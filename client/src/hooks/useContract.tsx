import { useState, useEffect } from 'react';
import getWeb3 from '../Web3'; // Assuming this is a function that returns a Web3 instance
import TokenContract from '../abis/Token.json';
import CSAMMContract from '../abis/CSAMM.json'; // Assuming you have your contract ABI and network details in a JSON file

const useContract = () => {
    const [tokenContractInstance, setTokenContractInstance] = useState<any>(null);
    const [csammContractInstance, setCsammContractInstance] = useState<any>(null);

    useEffect(() => {
        const initializeContracts = async () => {
            try {
                const web3: any = await getWeb3();

                const networkId = await web3.eth.net.getId();

                // Token Contract Instance
                const tokenDeployedNetwork = TokenContract.networks[networkId];
                const tokenInstance = new web3.eth.Contract(
                    TokenContract.abi,
                    tokenDeployedNetwork && tokenDeployedNetwork.address
                );
                setTokenContractInstance(tokenInstance);

                // CSAMM Contract Instance
                const csammDeployedNetwork = CSAMMContract.networks[networkId];
                const csammInstance = new web3.eth.Contract(
                    CSAMMContract.abi,
                    csammDeployedNetwork && csammDeployedNetwork.address
                );
                setCsammContractInstance(csammInstance);

            } catch (error) {
                console.error('Error initializing contracts:', error);
            }
        };

        initializeContracts();
    }, []);

    return { tokenContractInstance, csammContractInstance };
};

export default useContract;
