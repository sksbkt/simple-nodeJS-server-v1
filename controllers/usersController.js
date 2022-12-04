const User = require('../model/User')


async function getAllUsers(req, res) {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No user found' });
    res.json(users);
}

async function deleteUser(req, res) {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'User ID required' });
    const foundUser = await User.findOne({ _id: req.body.id });
    if (!foundUser) return res.status(204).json({ 'message': `No user found with ID: ${req.body.id}` });
    const result = await foundUser.deleteOne({ _id: req.body.id });
    // const result = User.deleteOne({ _id: req.body.id });
    res.json(result);
}

async function getUser(req, res) {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });
    const foundUser = await User.findOne({ _id: req.params.id }).exec();
    if (!foundUser) return res.status(204).json({ 'message': `No user found with ID: ${req.body.id}` });
    res.json({ foundUser });
}

module.exports = { getAllUsers, deleteUser, getUser }