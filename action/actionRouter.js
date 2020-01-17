const express = require('express');
const actions = require('../data/helpers/actionModel');
const projects = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/:id', (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "No id in URL." });
    }
    actions.get(req.params.id)
    .then(response => {
        const project_id = response.project_id;
        projects.get(project_id)
        .then(resp => {
            return res.status(200).json(resp.actions);
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Couldn't find any actions." })
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong." })
    })
})

router.post('/:id', (req, res) => {
    if (!req.body && req.body.description && req.body.notes) {
        return res.status(400).json({ error: "To add an action, you need a description, notes." })
    }
    
    const sendPackage = {
        description: req.body.description,
        notes: req.body.notes,
        project_id: req.params.id,
        completed: req.body.completed || 0
    }
    
    actions.insert(sendPackage)
    .then(response => {
        return res.status(201).json(response);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong." })
    })
})

router.delete('/:id', (req, res) => {
    if (!req.body && !req.body.id) {
        return res.status(400).json({ error: "There is no action with that ID" })
    }

    actions.remove(req.params.id)
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong deleting the action." })
    })
})

router.put('/:id', (req, res) => {
    if (!req.body.notes && !req.body.description) {
        return res.status(400).json({ error: "Notes and Description are required." })
    }

    const sendPackage = {
        notes: req.body.name,
        description: req.body.description,
        completed: req.body.completed || 0
    }

    actions.update(req.params.id, sendPackage)
    .then(() => {
        actions.get(req.params.id)
        .then(response => {
            return res.status(200).json(response);
        })
    })
})

function validateProjectID(req, res, next) {

    if (!req.params.id) {
        return res.status(400).json({ error: "No project ID found in URL." });
    }

    const projectIds = [];
    projects.get(req.params.id)
    .then(response => {
        // response is an object 
        // this needs to be changed
        Object.entries(response).forEach(element => {
            if (element[0] === 'id') {
                projectIds.push(Number(element[1]));
            }
        })
        if (projectIds.includes(Number(req.params.id))) {
            return next();
        }
        else {
            return res.status(400).json({ error: "Project ID not found." })
        }
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong." });
    })
}

module.exports = router;