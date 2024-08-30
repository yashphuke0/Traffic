const express = require('express');
const Locality = require('../models/locality');
const Node = require('../models/node');
const Signal = require('../models/signal');

const router = express.Router();

// Create a new locality
router.post('/locality', async (req, res) => {
  try {
    const locality = new Locality(req.body);
    await locality.save();
    res.status(201).send(locality);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all localities
router.get('/localities', async (req, res) => {
  try {
    const localities = await Locality.find().populate('nodes'); // Populate nodes for each locality
    res.status(200).send(localities);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Create a new node
router.post('/node', async (req, res) => {
  try {
    const node = new Node(req.body);
    await node.save();
    // Update the corresponding locality to add this node
    await Locality.findByIdAndUpdate(node.localityId, {
        $push: { nodes: node._id }
      });
    res.status(201).send(node);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all nodes in a locality
router.get('/locality/:id/nodes', async (req, res) => {
  try {
    const nodes = await Node.find({ localityId: req.params.id }).populate('signals'); // Populate signals for each node
    res.status(200).send(nodes);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Create a new signal
router.post('/signal', async (req, res) => {
  try {
    const signal = new Signal(req.body);
    await signal.save();
    await Node.findByIdAndUpdate(signal.nodeId, {
        $push: { signals: signal._id }
      });
    res.status(201).send(signal);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get signals for a node
router.get('/node/:id/signals', async (req, res) => {
  try {
    const signals = await Signal.find({ nodeId: req.params.id });
    res.status(200).send(signals);
  } catch (err) {
    res.status(400).send(err);
  }
});



module.exports = router;
