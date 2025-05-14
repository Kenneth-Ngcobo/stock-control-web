## Inventory and Job Management System

A comprehensive **Inventory and Job Management System** using **Vue.js**, **Node.js**, and **MySQL**, designed to streamline component tracking, job kitting, and procurement processes. The system supports **bulk importing of component data** from existing Excel records, storing details such as **quantity, price, and supplier information** in a structured MySQL database.

#### Key Features

- **Real-time search with auto-suggestions** on the front end for quick component lookup.
- **BOM (Bill of Materials) uploads**, which dynamically deduct components from stock when assigned to jobs.
- **Job kitting integration** with barcode scanning:
  - Components are scanned via a scanner connected to a **Raspberry Pi**.
  - The scanner communicates with the system using **WebSockets**, enabling real-time stock updates.
- **Low stock alerts**, which automatically notify buyers when components fall below threshold levels.
- **Supplier purchase order (PO) generation**, with tracking of **expected delivery dates (ETAs)**.
- **Job ETA estimation**, factoring in missing components, their POs, and ETAs to provide accurate forecasting.

This system significantly improved operational efficiency, enhanced inventory accuracy, and optimized procurement and production planning workflows.

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-C51A4A?style=for-the-badge&logo=raspberry-pi&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-1C6A7E?style=for-the-badge&logo=websocket&logoColor=white)

![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
