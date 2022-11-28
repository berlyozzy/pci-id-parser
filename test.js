import fetch from 'node-fetch'
import { find_pci_device, find_pci_device_via_key } from './index.js'

const main = async () => {

    const pci = async () => {
        const request_url = "https://raw.githubusercontent.com/pciutils/pciids/master/pci.ids"
        const response = await fetch(request_url);
        return await response.text();
    };

    const raw_data = await pci()

    console.log(find_pci_device_via_key({ 
        device_key : "Enum\PCI\VEN_10DE&DEV_1E81&SUBSYS_13A010DE&REV_A1",
        file : raw_data
    }))

    console.log(find_pci_device({ 
        vendor_id : "10DE", 
        device_id : "1E81", 
        subvendor_id : "10DE", 
        subdevice_id : "13A0",
        file : raw_data
    }))

}

main()