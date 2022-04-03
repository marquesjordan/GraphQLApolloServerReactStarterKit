const Message = require('../../models/Message');

module.exports = {
  Mutation: {
    async createMessage(_, { messageInput: { text, username } }) {
      const newMessage = new Message({
        text: text,
        createdBy: username,
        createdAt: new Date().toISOString(),
      });

      const res = await newMessage.save();
      console.log(res);
      return {
        id: res.id,
        ...res._doc,
      };
    },
    async deleteMessage(parent, args, context, info) {
      const { id } = args;
      await Message.findByIdAndDelete(id);
      return true;
    },
    async updateMessage(
      parrent,
      { id, messageInput: { text, username } },
      context,
      info,
    ) {
      const update = {};
      if (text !== undefined) {
        update.text = text;
      }
      if (username !== undefined) {
        update.username = username;
      }
      const message = await Message.findByIdAndUpdate(id, update, {
        new: true,
      });
      return message;
    },
  },
  Query: {
    getAllMessages: async () => await Message.find(),
    message: async (_, { id }) => {
      return await Message.findById(id);
    },
  },
};
