import React, { useState } from "react";
import { Button } from "./ui/button";
import { HomeIcon, CrownIcon, SlidersIcon, WalletIcon } from "lucide-react";
import Web3 from "web3";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface NavbarProps {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [isConnected, setIsConnected] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 50,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("No provider detected");
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const userAccounts = await web3.eth.getAccounts();
        const account = userAccounts[0];

        const ethBalance = await web3.eth.getBalance(account);
        const balanceInEther = web3.utils.fromWei(ethBalance, "ether");

        setIsConnected(true);

        // Show toast message
        toast.success(`Connected Account: ${account}\nBalance: ${balanceInEther} ETH`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        console.log("Connected Account:", account);
        console.log("ETH Balance:", balanceInEther);
      }
    } catch (error) {
      toast.error("Error connecting wallet. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.error("Error connecting wallet:", error);
    }
  };

  const onDisconnect = () => {
    toast.info("Disconnected Wallet", {
      position: "top-right",
      autoClose: 3000,
    });
    console.log("Disconnected Wallet");
    setIsConnected(false);
  };

  return (
    <div>
      {/* Toast Container for displaying notifications */}
      <ToastContainer />
      <div className="fixed top-0 left-0 h-full w-16 bg-slate-800 text-white shadow-lg flex flex-col items-center justify-between py-4">
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={() => scrollToSection("hero")}
            className={`w-12 h-12 rounded-full ${
              activeSection === "hero" ? "bg-emerald-800" : "bg-emerald-600"
            }`}
          >
            <HomeIcon />
          </Button>
          <Button
            onClick={() => scrollToSection("king")}
            className={`w-12 h-12 rounded-full ${
              activeSection === "king" ? "bg-emerald-800" : "bg-emerald-600"
            }`}
          >
            <CrownIcon />
          </Button>
          <Button
            onClick={() => scrollToSection("pools")}
            className={`w-12 h-12 rounded-full ${
              activeSection === "pools" ? "bg-emerald-800" : "bg-emerald-600"
            }`}
          >
            <SlidersIcon />
          </Button>
        </div>
        {!isConnected && (
          <Button
            className="w-12 h-12 bg-emerald-600 flex items-center justify-center rounded-full hover:bg-emerald-700"
            onClick={onConnect}
          >
            <WalletIcon />
          </Button>
        )}
        {isConnected && (
          <Button
            className="w-12 h-12 bg-red-600 flex items-center justify-center rounded-full hover:bg-red-700"
            onClick={onDisconnect}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
