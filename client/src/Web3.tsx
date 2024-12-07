import Web3 from "web3";

const getWeb3 = async () => {
    try {
        const provider = new Web3.providers.HttpProvider(
            "https://sepolia.infura.io/v3/f24e850f627f465680f4cf9a2be2d770"
        );
        const web3 = new Web3(provider);
        return web3;
    } catch (error) {
        throw new Error("Failed to initialize web3 with provided provider.");
    }
};

export default getWeb3;