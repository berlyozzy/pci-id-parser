A small library to parse a [PCI ID database](https://raw.githubusercontent.com/pciutils/pciids/master/pci.ids) into a JS Object or find a specific device. 

Inspired by [pci-ids](https://www.npmjs.com/package/pci-ids) ♥

# Installation

```bash
$ npm install pci-id-parser
```

# Usage Examples

Examples below use information from a [DxDiag file](https://support.microsoft.com/en-us/windows/open-and-run-dxdiag-exe-dad7792c-2ad5-f6cd-5a37-bf92228dfd85) as input.

```
---------------
Display Devices
---------------
           Card name: NVIDIA GeForce RTX 2080 SUPER
        Manufacturer: NVIDIA
           Chip type: GeForce RTX 2080 SUPER
          Device Key: Enum\PCI\VEN_10DE&DEV_1E81&SUBSYS_13A010DE&REV_A1
```

```js 

// Parse text PCI ID database to JS Object 
parse_pci_list({file = "STRING"})

{
  "ID VENDOR NAME" : [
    {
      "id" : "DEVICE ID",
      "name" : "DEVICE NAME",
      "subsystem" : [
        "SUBVENDOR_ID SUBDEVICE_ID NAME",
        ...
      ]
    },
    ...
  ],
  ...
}


// Find the device using provided information
find_pci_device({ 
    vendor_id : "10DE", 
    device_id : "1E81", 
    subvendor_id : "10DE", 
    subdevice_id : "13A0",
    file : raw_data
})

{
  vendor: 'NVIDIA Corporation',
  device: 'TU104 [GeForce RTX 2080 SUPER]',
  subdevice: 'UNKNOWN',
  subvendor: 'NVIDIA Corporation'
}


// If some IDs are not provided, the output will not include them i.e.
find_pci_device({ 
    vendor_id : "10DE", 
    file : raw_data
})

{
  vendor: 'NVIDIA Corporation',
}

//  or
find_pci_device({ 
    vendor_id : "10DE", 
    device_id : "1E81", 
    file : raw_data
})

{
  vendor: 'NVIDIA Corporation',
  device: 'TU104 [GeForce RTX 2080 SUPER]',
}


// Find the device using provided information
find_pci_device_via_key({ 
    device_key : "Enum\PCI\VEN_10DE&DEV_1E81&SUBSYS_13A010DE&REV_A1",
    file : raw_data
})

{
  vendor: 'NVIDIA Corporation',
  device: 'TU104 [GeForce RTX 2080 SUPER]',
  subdevice: 'UNKNOWN',
  subvendor: 'NVIDIA Corporation'
}

```

# Create a Local PCI ID list copy

```bash

# Install dependencies (node-fetch)
$ npm install

# Run get-list
$ npm run get-list -- -- --json  # --json (default) / --js / --javascript / --mjs

# The file will be created in the root
# The data can be imported from .js/.mjs as
import pci from 'path_to_file/pci-list.js'

```