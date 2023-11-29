require('dotenv').config();
const axios = require('axios');
const HOME_ASSISTANT_API_KEY = process.env.HOME_ASSISTANT_API_KEY;
const HOME_ASSISTANT_URL = process.env.HOME_ASSISTANT_URL;
console.log(HOME_ASSISTANT_URL);

async function checkAPI() {
    try {
        const response = await axios.get(`${HOME_ASSISTANT_URL}/api/`, {
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                "content-type": "application/json",
            }
        });
        console.log("Successfully connected to Home Assistant API:", response.data);
    } catch (error) {
        console.error('Error connecting to Home Assistant API:', error.response ? error.response.data : error.message);
    }
}

async function fetchEntities() {
    try {
        const response = await axios.get(`${HOME_ASSISTANT_URL}/api/states`, {
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                "content-type": "application/json",
            }
        });
        return response.data; // This will be an array of all entities
    } catch (error) {
        console.error('Error fetching entities:', error.response ? error.response.data : error.message);
        return [];
    }
}

async function listControllableDevices() {
    const entities = await fetchEntities();
    entities.forEach(entity => {
        if (entity.entity_id.startsWith('light.') || entity.entity_id.startsWith('switch.')) {
            console.log(`Entity ID: ${entity.entity_id}, State: ${entity.state}`);
        }
    });
}

listControllableDevices();

async function setColor(entityId, color) {
    try {
        const url = `${HOME_ASSISTANT_URL}/api/services/light/turn_on`;
        await axios.post(url, {
            entity_id: entityId,
            color_name: color
        }, {
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`Set ${entityId} to ${color}`);
    } catch (error) {
        console.error(`Error setting color of ${entityId}:`, error.response ? error.response.data : error.message);
    }
}

// Example usage
setColor('light.controller_rgb_ir_cfdb5f', 'green');
