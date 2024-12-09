# BloomFi

## Live Website Link

[https://bloom-fi.vercel.app/](https://bloom-fi.vercel.app/)

**Note:** Please make sure to log in or connect your wallet with MetaMask before continuing with the game.

## Project Overview

This project transforms traditional DeFi liquidity pools into an engaging and interactive gaming experience, designed to simplify complex investment strategies for users. The gamified interface helps users intuitively explore and interact with liquidity pools, represented as trees in a dynamic virtual ecosystem. By merging game mechanics with DeFi principles, we aim to make decentralized finance more accessible, fun, and personalized.

### Key Features

- **Gamified Liquidity Pools:** Liquidity pools are represented as **trees**, offering a visual and interactive experience.
- **Proximity-Based Pool ROI:** The **closer a pool is to the center of the island**, the higher its ROI, while pools with lower ROI or higher traffic are placed on the outer islands, creating a balanced and strategic exploration experience.
- **Personalized Pool Relevance:** Trees closer to the user's house signify trending or highly recommended pools based on user preferences.
- **LLM-Powered Recommendations:** A house on the map, powered by a **Large Language Model (LLM)**, analyzes user data to suggest optimal investment strategies.
- **Inventory Management:** A dedicated inventory system provides a detailed overview of the user's token holdings, aiding in strategic decision-making.

## Tech Integration

- **Polygon:** For seamless and scalable blockchain interactions.
- **Walrus:** We use Walrus for storing images, enabling efficient generative model pipelines and enhancing personalized recommendations in the ecosystem.
- **Balancer API and Graph:** To fetch and interact with liquidity pool data.

## Tech Stack

- **Frontend:** HTML, CSS, Tailwind CSS, Vanilla JavaScript
- **Backend:** Node.js
- **Smart Contracts:** Solidity

## How It Works

1. **Interactive Visualization:** Users interact with a gamified interface where trees represent liquidity pools.
2. **Data-Driven Insights:** The LLM analyzes user’s token portfolio, historical interactions, and pool trends to provide actionable recommendations.
3. **Token Management:** Users can view their holdings, track pool performance, and invest directly through the inventory system.

## Future Scope

- **Enhanced AI Integration:**
  - Integrate **Huddle01 AI** to incorporate text-to-speech models.
  - Develop virtual rooms for personalized suggestions and live user assistance.
- **Custom Data Management:**
  - Build a **custom Subgraph** for storing and querying essential pool data currently unavailable via the Balancer API.
- **Improved AI Models:**
  - Enhance recommendation models by incorporating broader datasets, including user interaction history and trending pools from external sources.
- **Expanding Gamified Features:**
  - Introduce additional interactive elements, such as dynamic pool growth animations or rewards for frequent participation.
- **Cross-Chain Compatibility:**
  - Expand support to other blockchains beyond Polygon to include Ethereum mainnet and Layer 2 solutions.
- **Community Engagement:**
  - Develop community challenges and leaderboards to encourage user participation and collaboration.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/ashith1101/BloomFi.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   Go Live
4. Access the app locally at `http://localhost:5050`.
