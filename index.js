const parse_pci_list = ({file = "STRING"}) => {

    const raw_data = file.split("\n")
    const data = new Map()

    const vendor_regex = /^[\d\w()\-]+/ 
    const device_regex = /^[\t]{1}[\d\w()\-]+/
    const sub_vendor_regex = /^[\t]{2}[\d\w()\-]+/

    let last_device = "";

    for(let line of raw_data){

        if (vendor_regex.test(line)) {
            data.set(line.trim(), [])
        }

        if (device_regex.test(line)) {

            const vendors = Array.from(data.keys())
            const last_vendor = vendors[vendors.length - 1];

            const device_list = data.get(last_vendor)
            device_list.push({
                id : line.trim().split("  ")[0],
                name : line.trim().split("  ")[1]
            })

            last_device = line.trim().split("  ")[0]
            data.set(last_vendor, device_list)

        }

        if (sub_vendor_regex.test(line)){

            const vendors = Array.from(data.keys())
            const last_vendor = vendors[vendors.length - 1];

            const device_list = data.get(last_vendor)
            const device_id = device_list.findIndex(e => e.id == last_device)

            if(device_list[device_id]["subsystem"] === undefined){
                device_list[device_id]["subsystem"] = []
            }

            device_list[device_id]["subsystem"] = [ 
                ...device_list[device_id]["subsystem"],
                line.trim()
            ]

            data.set(last_vendor, device_list)

        }

    }
}

const find_pci_device = ({ vendor_id = "", device_id = "", subvendor_id = "", subdevice_id = "", file = ""  }) => {

    const raw_data = file.split("\n");
    const output = {}

    if(raw_data == "" || vendor_id == ""){
        console.log("Missing PCI database input or a vendor ID")
        return false
    }

    const vendor_regex = new RegExp(`^${vendor_id}.+`, "i")
    const vendor = raw_data.find(e => vendor_regex.test(e))
    output["vendor"] = vendor !== undefined ? vendor.replace(/[\d\w ]+\s{2}/i, "").trim() : "UNKNOWN"

    if(device_id !== ""){
        const device_regex = new RegExp(`^[\t]{1}${device_id}.+`, "i")
        const device = raw_data.find(e => device_regex.test(e))
        output["device"] = device !== undefined ? device.replace(/[\d\w ]+\s{2}/i, "").trim() : "UNKNOWN"
    }

    if(subvendor_id !== "" && subdevice_id !== ""){
        const subdevice_regex = new RegExp(`^[\t]{2}${subvendor_id} ${subdevice_id}.+`, "i")
        const subdevice = raw_data.find(e => subdevice_regex.test(e))

        const subvendor_regex = new RegExp(`^${subvendor_id}.+`, "i")
        const subvendor = raw_data.find(e => subvendor_regex.test(e))

        output["subdevice"] = subdevice !== undefined ? subdevice.replace(/[\d\w ]+\s{2}/i, "").trim() : "UNKNOWN"
        output["subvendor"] = subvendor !== undefined ? subvendor.replace(/[\d\w ]+\s{2}/i, "").trim()  : "UNKNOWN"
    }else{
        if(subvendor_id == "" && subdevice_id !== ""){
            console.log("Missing subvendor_id")
        }else if(subvendor_id !== "" && subdevice_id == ""){
            console.log("Missing subdevice_id")
        }
    }

    return output

}

const find_pci_device_via_key = ({device_key = "", file = ""}) => {

    const raw_data = file.split("\n");
    const output = {}

    if(raw_data == "" || device_key == ""){
        console.log("Missing PCI database input or a vendor ID")
        return false
    }

    const vendor_id = device_key.match(/(?<=VEN_)[\w\d]{4}/i) !== null ? device_key.match(/(?<=VEN_)[\w\d]{4}/i)[0] : null
    const device_id = device_key.match(/(?<=DEV_)[\w\d]{4}/i) !== null ? device_key.match(/(?<=DEV_)[\w\d]{4}/i)[0] : null
    const subsystem = device_key.match(/(?<=SUBSYS_)[\w\d]{8}/i) !== null ? device_key.match(/(?<=SUBSYS_)[\w\d]{8}/i)[0] : null
    let subdevice_id = ""
    let subvendor_id = ""

    if(subsystem !== null && subsystem.length == 8){
        subdevice_id = subsystem.substring(0, 4)
        subvendor_id = subsystem.substring(4)
    }

    const vendor_regex = new RegExp(`^${vendor_id}.+`, "i")
    const vendor = raw_data.find(e => vendor_regex.test(e))
    output["vendor"] = vendor !== undefined ? vendor.replace(/[\d\w ]+\s{2}/i, "").trim() : "UNKNOWN"

    if(device_id !== ""){
        const device_regex = new RegExp(`^[\t]{1}${device_id}.+`, "i")
        const device = raw_data.find(e => device_regex.test(e))
        output["device"] = device !== undefined ? device.replace(/[\d\w ]+\s{2}/i, "").trim() : "UNKNOWN"
    }

    if(subvendor_id !== "" && subdevice_id !== ""){
        const subdevice_regex = new RegExp(`^[\t]{2}${subvendor_id} ${subdevice_id}.+`, "i")
        const subdevice = raw_data.find(e => subdevice_regex.test(e))

        const subvendor_regex = new RegExp(`^${subvendor_id}.+`, "i")
        const subvendor = raw_data.find(e => subvendor_regex.test(e))

        output["subdevice"] = subdevice !== undefined ? subdevice.replace(/[\d\w ]+\s{2}/i, "").trim() : "UNKNOWN"
        output["subvendor"] = subvendor !== undefined ? subvendor.replace(/[\d\w ]+\s{2}/i, "").trim()  : "UNKNOWN"
    }else{
        if(subvendor_id == "" && subdevice_id !== ""){
            console.log("Missing subvendor_id")
        }else if(subvendor_id !== "" && subdevice_id == ""){
            console.log("Missing subdevice_id")
        }
    }

    return output

}

export { parse_pci_list, find_pci_device, find_pci_device_via_key };