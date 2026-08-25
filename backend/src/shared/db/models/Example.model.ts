import { Schema, model } from "mongoose";

/* ===========================
   Embedded document schema
   =========================== */

const childSchema = new Schema({
  name: String,
  age: Number,
});

/* ===========================
   Referenced model
   =========================== */

const otherSchema = new Schema({
  title: String,
});

const OtherModel = model("Other", otherSchema);

/* ===========================
   Main model
   =========================== */

const exampleSchema = new Schema({
  // Primitive fields
  name: String,
  age: Number,
  active: Boolean,
  createdAt: Date,

  // Plain nested object
  metadata: {
    version: Number,
    author: String,
  },

  // Array of primitives
  tags: [String],

  // Embedded document
  child: childSchema,

  // Array of embedded documents
  children: [childSchema],

  // Single reference
  reference: {
    type: Schema.Types.ObjectId,
    ref: "Other",
  },

  // Array of references
  references: [
    {
      type: Schema.Types.ObjectId,
      ref: "Other",
    },
  ],
});

const ExampleModel = model("Example", exampleSchema);
