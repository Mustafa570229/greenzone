import  {model, Schema, models} from "mongoose";
const DataSchema = new Schema({
  newTitle: { type: String, required: true },
  newContent: { type: String, required: true },
  newCollection: { type: String, required: true },

},
{
    timestamps: true
});

export const MyData = models.MyData || model('MyData', DataSchema);

