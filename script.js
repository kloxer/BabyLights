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
                brightness: 255, // 100% brightness
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

async function turnOffSwitch(entityId){
   
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

async function turnOnSwitch(entityId){
   
    try {
        const url = `${HOME_ASSISTANT_URL}/api/services/switch/turn_on`;
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

async function turnOnLightAndSwitch() {
    const lightEntityId = "light.controller_rgb_ir_cfdb5f";
    const switchEntityId = "switch.bedroom_light";

    try {
        // Turn on the light with full brightness and white color
        const lightUrl = `${HOME_ASSISTANT_URL}/api/services/light/turn_on`;
        await fetch(lightUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                entity_id: lightEntityId,
                brightness: 255, // 100% brightness
                color_name: "white"
            })
        });

        // Turn on the switch
        const switchUrl = `${HOME_ASSISTANT_URL}/api/services/switch/turn_on`;
        await fetch(switchUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entity_id: switchEntityId })
        });

        

        console.log(`Turned on ${lightEntityId} and ${switchEntityId}`);
    } catch (error) {
        console.error(`Error in turning on devices:`, error);
    }
}


async function turnOFFLightAndSwitch() {
    const lightEntityId = "light.controller_rgb_ir_cfdb5f";
    const switchEntityId = "switch.bedroom_light";

    try {
        // Turn on the light with full brightness and white color
        const lightUrl = `${HOME_ASSISTANT_URL}/api/services/light/turn_off`;
        await fetch(lightUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                entity_id: lightEntityId
            })
        });

        // Turn on the switch
        const switchUrl = `${HOME_ASSISTANT_URL}/api/services/switch/turn_off`;
        await fetch(switchUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HOME_ASSISTANT_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ entity_id: switchEntityId })
        });

        

        console.log(`Turned off ${lightEntityId} and ${switchEntityId}`);
    } catch (error) {
        console.error(`Error in turning on devices:`, error);
    }
}


