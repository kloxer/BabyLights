const HOME_ASSISTANT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmZjNhZTRiOTRhMTg0Y2ViYmIzMWNkNDg4N2MzMzlkMSIsImlhdCI6MTcwMTI5Mzc3NiwiZXhwIjoyMDE2NjUzNzc2fQ.tKXrI9PeMTKTAm9Pz3SBYEW1bVfNpKf7XNV12mzw1Co";
const HOME_ASSISTANT_URL = "https://socaresrpi.duckdns.org:8123";

async function fetchEntities() {
    try {
        const response = await fetch(`${HOME_ASSISTANT_URL}/api/states`, {
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // This will be an array of all entities
    } catch (error) {
        console.error('Error fetching entities:', error);
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
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                entity_id: entityId,
                color_name: color
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        turnOffMain();
        console.log(`Set ${entityId} to ${color}:`, data);
    } catch (error) {
        console.error(`Error setting color of ${entityId}:`, error);
    }
}

async function turnOffMain(){
    entityId= "switch.bedroom_light";
    try {
        const url = `${HOME_ASSISTANT_URL}/api/services/switch/turn_off`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                entity_id: entityId
                        })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Turned off '+ entityId);
    } catch (error) {
        console.error(`Error turning off ${entityId}:`, error);
    }
}
