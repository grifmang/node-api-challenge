const express = require('express');
const projects = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/:id', validateProjectID, (req, res) => {
    projects.get(req.params.id)
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({ error: "No project found with that ID." })
    })
})

router.post('/', (req, res) => {
    if (!req.body.name && req.body.description) {
        return res.status(400).json({ error: "Name and Description required." })
    }

    const sendPackage = {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed || 0
    }
    projects.insert(sendPackage)
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Error adding project." })
    })
})

router.delete('/:id', validateProjectID, (req, res) => {
    projects.remove(req.params.id)
    .then(response => {
        return res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong when attempting to delete project."});
    })
})

router.put('/:id', validateProjectID, (req, res) => {
    if (!req.body.name && !req.body.description) {
        return res.status(400).json({ error: "Name and Description required." })
    }

    const sendPackage = {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed || 0
    }

    projects.update(req.params.id, sendPackage)
    .then(() => {
        projects.get(req.params.id)
        .then(response => {
            return res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({ error: "Could not update project." })
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