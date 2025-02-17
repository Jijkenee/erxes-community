import { Schema, Document } from 'mongoose';

import { ruleSchema } from '@erxes/api-utils/src/definitions/common';
import { field, schemaWrapper } from '@erxes/api-utils/src/definitions/utils';
import { IRule } from "@erxes/api-utils/src/types";
import { MESSENGER_KINDS, CAMPAIGN_METHODS, CAMPAIGN_KINDS, SENT_AS_CHOICES } from '../../constants';

interface IEmail {
  attachments?: any;
  subject?: string;
  content?: string;
  replyTo?: string;
  sender?: string;
  templateId?: string;
}

interface IEmailDocument extends IEmail, Document {}

interface IScheduleDate {
  type?: string;
  month?: string | number;
  day?: string | number;
  dateTime?: string | Date;
}


interface IScheduleDateDocument extends IScheduleDate, Document {}

interface IMessenger {
  brandId?: string;
  kind?: string;
  sentAs?: string;
  content: string;
  rules?: IRule[];
}

interface IMessengerDocument extends IMessenger, Document {}

export interface IShortMessage {
  content: string;
  from?: string;
  fromIntegrationId: string;
}

export interface IEngageMessage {
  kind: string;
  segmentIds?: string[];
  brandIds?: string[];
  // normal tagging
  tagIds?: string[];
  // customer selection tags
  customerTagIds?: string[];
  customerIds?: string[];
  title: string;
  fromUserId?: string;
  method: string;
  isDraft?: boolean;
  isLive?: boolean;
  stopDate?: Date;
  messengerReceivedCustomerIds?: string[];
  email?: IEmail;
  scheduleDate?: IScheduleDate;
  messenger?: IMessenger;
  lastRunAt?: Date;
  shortMessage?: IShortMessage;

  totalCustomersCount?: number;
  validCustomersCount?: number;
  runCount?: number;
  createdBy?: string;
}

export interface IEngageMessageDocument extends IEngageMessage, Document {
  scheduleDate?: IScheduleDateDocument;
  createdAt: Date;

  email?: IEmailDocument;
  messenger?: IMessengerDocument;

  _id: string;
}

// Mongoose schemas =======================
export const scheduleDateSchema = new Schema(
  {
    type: field({ type: String, optional: true, label: 'Type' }),
    month: field({ type: String, optional: true, label: 'Month' }),
    day: field({ type: String, optional: true, label: 'Day' }),
    dateTime: field({
      type: Date,
      optional: true,
      label: 'DateTime',
      min: [Date.now, `Date time value must be greather than today`]
    })
  },
  { _id: false }
);

export const emailSchema = new Schema(
  {
    attachments: field({ type: Object, optional: true, label: 'Attachments' }),
    subject: field({ type: String, label: 'Subject' }),
    sender: field({ type: String, optional: true, label: 'Sender' }),
    replyTo: field({ type: String, optional: true, label: 'Reply to' }),
    content: field({ type: String, label: 'Content' }),
    templateId: field({ type: String, optional: true, label: 'Template' })
  },
  { _id: false }
);

export const messengerSchema = new Schema(
  {
    brandId: field({ type: String, label: 'Brand' }),
    kind: field({
      type: String,
      enum: MESSENGER_KINDS.ALL,
      label: 'Kind'
    }),
    sentAs: field({
      type: String,
      enum: SENT_AS_CHOICES.ALL,
      label: 'Sent as'
    }),
    content: field({ type: String, label: 'Content' }),
    rules: field({ type: [ruleSchema], label: 'Rules' })
  },
  { _id: false }
);

export const smsSchema = new Schema(
  {
    from: field({ type: String, label: 'From text', optional: true }),
    content: field({ type: String, label: 'SMS content' }),
    fromIntegrationId: field({ type: String, label: 'Configured integration' })
  },
  { _id: false }
);

export const engageMessageSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    kind: field({ type: String, label: 'Kind', enum: CAMPAIGN_KINDS.ALL }),
    segmentId: field({ type: String, optional: true }), // TODO Remove
    segmentIds: field({
      type: [String],
      optional: true,
      label: 'Segments'
    }),
    brandIds: field({
      type: [String],
      optional: true,
      label: 'Brands'
    }),
    customerIds: field({ type: [String], label: 'Customers' }),
    title: field({ type: String, label: 'Title' }),
    fromUserId: field({ type: String, label: 'From user' }),
    method: field({
      type: String,
      enum: CAMPAIGN_METHODS.ALL,
      label: 'Method'
    }),
    isDraft: field({ type: Boolean, label: 'Is draft' }),
    isLive: field({ type: Boolean, label: 'Is live' }),
    stopDate: field({ type: Date, label: 'Stop date' }),
    createdAt: field({
      type: Date,
      default: Date.now,
      label: 'Created at',
      index: true
    }),
    tagIds: field({
      type: [String],
      optional: true,
      label: 'Tags',
      index: true
    }),
    customerTagIds: field({
      type: [String],
      optional: true,
      label: 'Chosen customer tag ids'
    }),
    messengerReceivedCustomerIds: field({
      type: [String],
      label: 'Received customers'
    }),

    email: field({ type: emailSchema, label: 'Email' }),
    scheduleDate: field({ type: scheduleDateSchema, label: 'Schedule date' }),
    messenger: field({ type: messengerSchema, label: 'Messenger' }),
    lastRunAt: field({ type: Date, optional: true }),

    totalCustomersCount: field({ type: Number, optional: true }),
    validCustomersCount: field({ type: Number, optional: true }),

    shortMessage: field({ type: smsSchema, label: 'Short message' }),
    createdBy: field({ type: String, label: 'Created user id' }),
    runCount: field({
      type: Number,
      label: 'Run count',
      optional: true,
      default: 0
    })
  })
);
