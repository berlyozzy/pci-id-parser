import fs from 'fs';
import fetch from 'node-fetch';

const main = async () => {

    console.log(process.argv)

    const optional_arguments = process.argv.filter(e => e.startsWith("--"));
    let output_format = "json";

    if(optional_arguments.length != 0){
        switch (optional_arguments[0]) {
            case "--json":
                output_format = "json";
                break;

            case "--javascript":
            case "--js":
                output_format = "js";
                break;   

            case "--mjs":
                output_format = "mjs";
                break;   
            default:
                break;
        }
    }

    const pci = async () => {
        const request_url = "https://raw.githubusercontent.com/pciutils/pciids/master/pci.ids"
        const response = await fetch(request_url);
        return await response.text();
    };

    const raw_data = (await pci()).split("\n")
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

    switch (output_format) {
        case "json":
            fs.writeFileSync('pci-list.json', JSON.stringify(Object.fromEntries(data)), { encoding : "utf-8" })
            break;

        case "mjs":
        case "js":
            const template = `const pci = ${JSON.stringify(Object.fromEntries(data))};

            export default pci;
            `
            fs.writeFileSync(`pci-list.${output_format}`, template, { encoding : "utf-8" })
            break;
    }

}

main();