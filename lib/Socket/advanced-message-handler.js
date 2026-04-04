'use strict';

const WAProto = require('../../WAProto').proto;
const crypto = require('crypto');
const Utils = require('../Utils');

const MESSAGE_TYPES = Object.freeze({
    PAYMENT: 'PAYMENT',
    PRODUCT: 'PRODUCT',
    INTERACTIVE: 'INTERACTIVE',
    ALBUM: 'ALBUM',
    EVENT: 'EVENT',
    POLL_RESULT: 'POLL_RESULT',
    GROUP_STORY: 'GROUP_STORY',
});

const DEFAULT_CURRENCY = 'IDR';

function resolveMediaInput(value) {
    if (value && typeof value === 'object' && !(value instanceof Buffer) && value.url) {
        return { url: value.url };
    }
    return value;
}

function parseTimestamp(value, fallback = Date.now()) {
    if (value === undefined || value === null) return fallback;
    return typeof value === 'string' ? parseInt(value, 10) : value;
}

class WAMessageHandler {
    constructor(utils, waUploadToServer, relayMessageFn) {
        this.utils = utils;
        this.waUploadToServer = waUploadToServer;
        this.relayMessage = relayMessageFn;
        this._bail = {
            generateWAMessageContent: utils.generateWAMessageContent ?? Utils.generateWAMessageContent,
            generateMessageID: Utils.generateMessageID,
            getContentType: (msg) => Object.keys(msg.message ?? {})[0],
        };
    }

    detectType(content) {
        if (content.requestPaymentMessage) return MESSAGE_TYPES.PAYMENT;
        if (content.productMessage) return MESSAGE_TYPES.PRODUCT;
        if (content.interactiveMessage) return MESSAGE_TYPES.INTERACTIVE;
        if (content.albumMessage) return MESSAGE_TYPES.ALBUM;
        if (content.eventMessage) return MESSAGE_TYPES.EVENT;
        if (content.pollResultMessage) return MESSAGE_TYPES.POLL_RESULT;
        if (content.groupStatusMessage) return MESSAGE_TYPES.GROUP_STORY;
        return null;
    }

    async handlePayment(content, quoted) {
        const data = content.requestPaymentMessage;
        let notes = {};

        const baseContextInfo = {
            stanzaId: quoted?.key?.id,
            participant: quoted?.key?.participant ?? content.sender,
            quotedMessage: quoted?.message,
        };

        if (data.sticker?.stickerMessage) {
            notes = {
                stickerMessage: {
                    ...data.sticker.stickerMessage,
                    contextInfo: baseContextInfo,
                },
            };
        } else if (data.note) {
            notes = {
                extendedTextMessage: {
                    text: data.note,
                    contextInfo: baseContextInfo,
                },
            };
        }

        return {
            requestPaymentMessage: WAProto.Message.RequestPaymentMessage.fromObject({
                expiryTimestamp: data.expiry ?? 0,
                amount1000: data.amount ?? 0,
                currencyCodeIso4217: data.currency ?? DEFAULT_CURRENCY,
                requestFrom: data.from ?? '0@s.whatsapp.net',
                noteMessage: notes,
                background: data.background ?? {
                    id: 'DEFAULT',
                    placeholderArgb: 0xFFF0F0F0,
                },
            }),
        };
    }

    async handleProduct(content, jid, quoted) {
        const {
            title,
            description,
            thumbnail,
            productId,
            retailerId,
            url,
            body = '',
            footer = '',
            buttons = [],
            priceAmount1000 = null,
            currencyCode = DEFAULT_CURRENCY,
        } = content.productMessage;

        let productImage;

        if (Buffer.isBuffer(thumbnail)) {
            ({ imageMessage: productImage } = await this.utils.generateWAMessageContent(
                { image: thumbnail },
                { upload: this.waUploadToServer },
            ));
        } else if (thumbnail?.url) {
            ({ imageMessage: productImage } = await this.utils.generateWAMessageContent(
                { image: { url: thumbnail.url } },
                { upload: this.waUploadToServer },
            ));
        }

        return {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: body },
                        footer: { text: footer },
                        header: {
                            title,
                            hasMediaAttachment: true,
                            productMessage: {
                                product: {
                                    productImage,
                                    productId,
                                    title,
                                    description,
                                    currencyCode,
                                    priceAmount1000,
                                    retailerId,
                                    url,
                                    productImageCount: 1,
                                },
                                businessOwnerJid: '0@s.whatsapp.net',
                            },
                        },
                        nativeFlowMessage: { buttons },
                    },
                },
            },
        };
    }

    async handleInteractive(content, jid, quoted) {
        const {
            title,
            footer,
            thumbnail,
            image,
            video,
            document,
            mimetype,
            fileName,
            jpegThumbnail,
            contextInfo,
            externalAdReply,
            buttons = [],
            nativeFlowMessage,
            header,
        } = content.interactiveMessage;

        const { media } = await this._resolveInteractiveMedia({
            thumbnail, image, video, document, jpegThumbnail, mimetype, fileName,
        });

        const interactive = {
            body: { text: title ?? '' },
            footer: { text: footer ?? '' },
        };

        if (buttons.length > 0 || nativeFlowMessage) {
            interactive.nativeFlowMessage = {
                ...(buttons.length > 0 ? { buttons } : {}),
                ...(nativeFlowMessage ?? {}),
            };
        }

        interactive.header = media
            ? { title: header ?? '', hasMediaAttachment: true, ...media }
            : { title: header ?? '', hasMediaAttachment: false };

        const finalContextInfo = this._buildContextInfo(contextInfo, externalAdReply);
        if (Object.keys(finalContextInfo).length > 0) {
            interactive.contextInfo = finalContextInfo;
        }

        return { interactiveMessage: interactive };
    }

    async handleAlbum(content, jid, quoted) {
        const items = content.albumMessage;

        const album = await this.utils.generateWAMessageFromContent(jid, {
            messageContextInfo: { messageSecret: crypto.randomBytes(32) },
            albumMessage: {
                expectedImageCount: items.filter(i => Object.hasOwn(i, 'image')).length,
                expectedVideoCount: items.filter(i => Object.hasOwn(i, 'video')).length,
            },
        }, {
            userJid: this._generateParticipantJid(),
            quoted,
            upload: this.waUploadToServer,
        });

        await this.relayMessage(jid, album.message, { messageId: album.key.id });

        for (const item of items) {
            const mediaMsg = await this.utils.generateWAMessage(jid, item, {
                upload: this.waUploadToServer,
            });

            mediaMsg.message.messageContextInfo = {
                messageSecret: crypto.randomBytes(32),
                messageAssociation: {
                    associationType: 1,
                    parentMessageKey: album.key,
                },
                participant: '0@s.whatsapp.net',
                remoteJid: 'status@broadcast',
                forwardingScore: 99999,
                isForwarded: true,
                mentionedJid: [jid],
                starred: true,
                labels: ['Y', 'Important'],
                isHighlighted: true,
                businessMessageForwardInfo: { businessOwnerJid: jid },
                dataSharingContext: { showMmDisclosure: true },
            };

            mediaMsg.message.forwardedNewsletterMessageInfo = {
                newsletterJid: '0@newsletter',
                serverMessageId: 1,
                newsletterName: 'WhatsApp',
                contentType: 1,
                timestamp: new Date().toISOString(),
                senderName: 'WhatsApp',
                content: 'Media Message',
                priority: 'high',
                status: 'sent',
            };

            mediaMsg.message.disappearingMode = {
                initiator: 3,
                trigger: 4,
                initiatorDeviceJid: jid,
                initiatedByExternalService: true,
                initiatedByUserDevice: true,
                initiatedBySystem: true,
                initiatedByServer: true,
                initiatedByAdmin: true,
                initiatedByUser: true,
                initiatedByApp: true,
                initiatedByBot: true,
                initiatedByMe: true,
            };

            await this.relayMessage(jid, mediaMsg.message, {
                messageId: mediaMsg.key.id,
                quoted: {
                    key: {
                        remoteJid: album.key.remoteJid,
                        id: album.key.id,
                        fromMe: true,
                        participant: this._generateParticipantJid(),
                    },
                    message: album.message,
                },
            });
        }

        return album;
    }

    async handleEvent(content, jid, quoted) {
        const eventData = content.eventMessage;

        const msg = await this.utils.generateWAMessageFromContent(jid, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                        messageSecret: crypto.randomBytes(32),
                        supportPayload: JSON.stringify({
                            version: 2,
                            is_ai_message: true,
                            should_show_system_message: true,
                            ticket_id: crypto.randomBytes(16).toString('hex'),
                        }),
                    },
                    eventMessage: {
                        contextInfo: {
                            mentionedJid: [jid],
                            participant: jid,
                            remoteJid: 'status@broadcast',
                        },
                        isCanceled: eventData.isCanceled ?? false,
                        name: eventData.name,
                        description: eventData.description,
                        location: eventData.location ?? {
                            degreesLatitude: 0,
                            degreesLongitude: 0,
                            name: 'Location',
                        },
                        joinLink: eventData.joinLink ?? '',
                        startTime: parseTimestamp(eventData.startTime),
                        endTime: parseTimestamp(eventData.endTime, Date.now() + 3600000),
                        extraGuestsAllowed: eventData.extraGuestsAllowed !== false,
                    },
                },
            },
        }, { quoted });

        await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    }

    async handlePollResult(content, jid, quoted) {
        const pollData = content.pollResultMessage;

        const msg = await this.utils.generateWAMessageFromContent(jid, {
            pollResultSnapshotMessage: {
                name: pollData.name,
                pollVotes: pollData.pollVotes.map(vote => ({
                    optionName: vote.optionName,
                    optionVoteCount: String(vote.optionVoteCount),
                })),
            },
        }, {
            userJid: this._generateParticipantJid(),
            quoted,
        });

        await this.relayMessage(jid, msg.message, { messageId: msg.key.id });
        return msg;
    }

    async handleGroupStory(content, jid, quoted) {
        const storyData = content.groupStatusMessage;
        let waMsgContent;

        if (storyData.message) {
            waMsgContent = storyData;
        } else {
            const generateFn =
                this._bail.generateWAMessageContent ??
                this.utils.generateWAMessageContent ??
                this.utils.prepareMessageContent ??
                Utils.generateWAMessageContent;

            waMsgContent = await generateFn(storyData, { upload: this.waUploadToServer });
        }

        return this.relayMessage(jid, {
            groupStatusMessageV2: {
                message: waMsgContent.message ?? waMsgContent,
            },
        }, {
            messageId: this._bail.generateMessageID(),
        });
    }

    _generateParticipantJid() {
        return Utils.generateMessageID().split('@')[0] + '@s.whatsapp.net';
    }

    async _resolveInteractiveMedia({ thumbnail, image, video, document, jpegThumbnail, mimetype, fileName }) {
        const upload = this.waUploadToServer;

        if (thumbnail) {
            return {
                media: await this.utils.prepareWAMessageMedia({ image: { url: thumbnail } }, { upload }),
                mediaType: 'image',
            };
        }

        if (image) {
            return {
                media: await this.utils.prepareWAMessageMedia({ image: resolveMediaInput(image) }, { upload }),
                mediaType: 'image',
            };
        }

        if (video) {
            return {
                media: await this.utils.prepareWAMessageMedia({ video: resolveMediaInput(video) }, { upload }),
                mediaType: 'video',
            };
        }

        if (document) {
            const documentPayload = { document };
            if (jpegThumbnail) documentPayload.jpegThumbnail = resolveMediaInput(jpegThumbnail);

            const media = await this.utils.prepareWAMessageMedia(documentPayload, { upload });
            if (fileName) media.documentMessage.fileName = fileName;
            if (mimetype) media.documentMessage.mimetype = mimetype;

            return { media, mediaType: 'document' };
        }

        return { media: null, mediaType: null };
    }

    _buildContextInfo(contextInfo, externalAdReply) {
        const result = {};

        if (contextInfo) {
            Object.assign(result, {
                mentionedJid: [],
                forwardingScore: 0,
                isForwarded: false,
                ...contextInfo,
            });
        }

        if (externalAdReply) {
            result.externalAdReply = {
                title: '',
                body: '',
                mediaType: 1,
                thumbnailUrl: '',
                mediaUrl: '',
                sourceUrl: '',
                showAdAttribution: false,
                renderLargerThumbnail: false,
                ...externalAdReply,
            };
        }

        return result;
    }
}

WAMessageHandler.MESSAGE_TYPES = MESSAGE_TYPES;

module.exports = WAMessageHandler;
