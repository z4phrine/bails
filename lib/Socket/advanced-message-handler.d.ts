// advanced-message-handler.d.ts — Type definitions for WAMessageHandler
import { proto } from '../../WAProto';

declare namespace WAMessageHandler {

    interface WAMediaUploadFunction {
        (stream: Buffer | NodeJS.ReadableStream, options?: {
            fileEncSha256?: Buffer;
            mediaType?: string;
            newsletter?: boolean;
        }): Promise<{ url: string; directPath: string }>;
    }

    interface WAMessageContentGenerationOptions {
        upload?: WAMediaUploadFunction;
        mediaCache?: unknown;
        options?: unknown;
        logger?: unknown;
    }

    interface Utils {
        prepareWAMessageMedia        : (media: unknown, options: WAMessageContentGenerationOptions) => Promise<unknown>;
        generateWAMessageContent     : (content: unknown, options: WAMessageContentGenerationOptions) => Promise<unknown>;
        generateWAMessageFromContent : (jid: string, content: unknown, options?: unknown) => Promise<unknown>;
        generateWAMessage            : (jid: string, content: unknown, options?: unknown) => Promise<unknown>;
        generateMessageID            : () => string;
        prepareMessageContent?       : (content: unknown, options?: unknown) => Promise<unknown>;
    }

    interface StickerMessage {
        url               : string;
        fileSha256        : Buffer | string;
        fileEncSha256     : Buffer | string;
        mediaKey          : Buffer | string;
        mimetype          : string;
        directPath        : string;
        fileLength        : number | string;
        mediaKeyTimestamp : number | string;
        isAnimated?       : boolean;
        stickerSentTs?    : number | string;
        isAvatar?         : boolean;
        isAiSticker?      : boolean;
        isLottie?         : boolean;
    }

    interface PaymentMessage {
        amount     : number;
        currency?  : string;
        from?      : string;
        expiry?    : number;
        sticker?   : { stickerMessage: StickerMessage };
        note?      : string;
        background?: {
            id?              : string;
            fileLength?      : string;
            width?           : number;
            height?          : number;
            mimetype?        : string;
            placeholderArgb? : number;
            textArgb?        : number;
            subtextArgb?     : number;
        };
    }

    interface ProductMessage {
        title            : string;
        description      : string;
        thumbnail        : Buffer | { url: string };
        productId        : string;
        retailerId       : string;
        url              : string;
        body?            : string;
        footer?          : string;
        buttons?         : proto.Message.InteractiveMessage.INativeFlowButton[];
        priceAmount1000? : number | null;
        currencyCode?    : string;
    }

    type MediaInput = string | Buffer | { url: string };

    interface InteractiveMessage {
        title?             : string;
        header?            : string;
        footer?            : string;
        thumbnail?         : string;
        image?             : MediaInput;
        video?             : MediaInput;
        document?          : MediaInput;
        mimetype?          : string;
        fileName?          : string;
        jpegThumbnail?     : MediaInput;
        contextInfo?       : Record<string, unknown>;
        externalAdReply?   : {
            title?                 : string;
            body?                  : string;
            mediaType?             : number;
            thumbnailUrl?          : string;
            mediaUrl?              : string;
            sourceUrl?             : string;
            showAdAttribution?     : boolean;
            renderLargerThumbnail? : boolean;
            [key: string]          : unknown;
        };
        buttons?           : proto.Message.InteractiveMessage.INativeFlowButton[];
        nativeFlowMessage? : {
            messageParamsJson? : string;
            buttons?           : proto.Message.InteractiveMessage.INativeFlowButton[];
            [key: string]      : unknown;
        };
    }

    interface AlbumItem {
        image? : MediaInput & { caption?: string };
        video? : MediaInput & { caption?: string };
    }

    interface EventMessage {
        isCanceled?         : boolean;
        name                : string;
        description         : string;
        location?           : { degreesLatitude: number; degreesLongitude: number; name: string };
        joinLink?           : string;
        startTime?          : string | number;
        endTime?            : string | number;
        extraGuestsAllowed? : boolean;
    }

    interface PollVote {
        optionName      : string;
        optionVoteCount : string | number;
    }

    interface PollResultMessage {
        name      : string;
        pollVotes : PollVote[];
    }

    interface GroupStatusMessage {
        message?   : unknown;
        image?     : MediaInput;
        video?     : MediaInput;
        text?      : string;
        caption?   : string;
        document?  : MediaInput;
        [key: string]: unknown;
    }

    interface MessageContent {
        requestPaymentMessage? : PaymentMessage;
        productMessage?        : ProductMessage;
        interactiveMessage?    : InteractiveMessage;
        albumMessage?          : AlbumItem[];
        eventMessage?          : EventMessage;
        pollResultMessage?     : PollResultMessage;
        groupStatusMessage?    : GroupStatusMessage;
        sender?                : string;
    }

    type MessageTypeName =
        | 'PAYMENT'
        | 'PRODUCT'
        | 'INTERACTIVE'
        | 'ALBUM'
        | 'EVENT'
        | 'POLL_RESULT'
        | 'GROUP_STORY';

    const MESSAGE_TYPES: Readonly<Record<MessageTypeName, MessageTypeName>>;
}

declare class WAMessageHandler {
    constructor(
        utils            : WAMessageHandler.Utils,
        waUploadToServer : WAMessageHandler.WAMediaUploadFunction,
        relayMessageFn?  : (jid: string, content: unknown, options?: unknown) => Promise<unknown>
    );

    static readonly MESSAGE_TYPES: Readonly<Record<WAMessageHandler.MessageTypeName, WAMessageHandler.MessageTypeName>>;

    detectType(content: WAMessageHandler.MessageContent): WAMessageHandler.MessageTypeName | null;

    handlePayment(
        content : { requestPaymentMessage: WAMessageHandler.PaymentMessage; sender?: string },
        quoted? : proto.IWebMessageInfo
    ): Promise<{ requestPaymentMessage: proto.Message.IRequestPaymentMessage }>;

    handleProduct(
        content : { productMessage: WAMessageHandler.ProductMessage },
        jid     : string,
        quoted? : proto.IWebMessageInfo
    ): Promise<{ viewOnceMessage: proto.Message.IFutureProofMessage }>;

    handleInteractive(
        content : { interactiveMessage: WAMessageHandler.InteractiveMessage },
        jid     : string,
        quoted? : proto.IWebMessageInfo
    ): Promise<{ interactiveMessage: proto.Message.IInteractiveMessage }>;

    handleAlbum(
        content : { albumMessage: WAMessageHandler.AlbumItem[] },
        jid     : string,
        quoted? : proto.IWebMessageInfo
    ): Promise<proto.IWebMessageInfo>;

    handleEvent(
        content : { eventMessage: WAMessageHandler.EventMessage },
        jid     : string,
        quoted? : proto.IWebMessageInfo
    ): Promise<proto.IWebMessageInfo>;

    handlePollResult(
        content : { pollResultMessage: WAMessageHandler.PollResultMessage },
        jid     : string,
        quoted? : proto.IWebMessageInfo
    ): Promise<proto.IWebMessageInfo>;

    handleGroupStory(
        content : { groupStatusMessage: WAMessageHandler.GroupStatusMessage },
        jid     : string,
        quoted? : proto.IWebMessageInfo
    ): Promise<proto.IWebMessageInfo>;

    utils            : WAMessageHandler.Utils;
    waUploadToServer : WAMessageHandler.WAMediaUploadFunction;
    relayMessage     : (jid: string, content: unknown, options?: unknown) => Promise<unknown>;
}

export = WAMessageHandler;
