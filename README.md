
# Therm-Pool

## Introduction
Welcome to Therm-Pool, the dedicated mining pool for ThermCoin - our innovative cryptocurrency protocol. Therm-Pool is designed to provide a seamless mining experience, facilitating users in registering and managing their mining nodes, and ensuring fair and secure distribution of mining rewards.

## Project Structure
Therm-Pool consists of three primary components:

1. /frontend: A user-friendly interface built with Next.js, enabling users to interact with the backend system. Users can register, modify their node ID, and associate their wallet addresses through this platform.

2. /backend: The backbone of Therm-Pool where miner data is securely stored. This includes node IDs, wallet addresses, and passwords. Our backend is built with robust security measures to ensure the safety of user data.

3. /scripts: Contains the reward script that is the heart of the mining reward process. This script first verifies that a miner is connected to the network and actively mining. Once verified, the script disburses rewards in ThermCoins to the miners.

## Features
- User Registration: Easy and secure registration process for new miners.
- Node Management: Facilities to modify and manage node IDs and associated wallet addresses.
- Secure Data Storage: Enhanced security protocols to protect sensitive miner data.
- Automated Reward Distribution: Efficient and fair distribution of mining rewards in ThermCoin.