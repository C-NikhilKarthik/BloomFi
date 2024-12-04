import React, { useState } from 'react';
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Link, Globe, Twitter, Github } from "lucide-react";

const CreatePool: React.FC = () => {
  const [poolData, setPoolData] = useState({
    name: '',
    ticker: '',
    description: '',
    imageUrl: '',
    network: '',
    socialLinks: {
      website: '',
      twitter: '',
      github: ''
    }
  });

  const networks = [
    { value: 'mainnet', label: 'Ethereum Mainnet' },
    { value: 'base', label: 'Base Network' },
    { value: 'arbitrum', label: 'Arbitrum Network' },
    { value: 'optimism', label: 'Optimism Network' },
    { value: 'polygon', label: 'Polygon Network' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPoolData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNetworkChange = (value: string) => {
    setPoolData(prev => ({
      ...prev,
      network: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof typeof poolData.socialLinks, value: string) => {
    setPoolData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement pool creation logic
    console.log('Pool Data:', poolData);
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-white">Create Pool</CardTitle>
          <CardDescription className="text-slate-400">
            Launch your high ROI pool in the Ethereum ecosystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Pool Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Pool Name</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="Enter pool name"
                  value={poolData.name}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticker" className="text-white">Ticker Symbol</Label>
                <Input 
                  id="ticker"
                  name="ticker"
                  placeholder="Pool ticker"
                  value={poolData.ticker}
                  onChange={handleInputChange}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea 
                id="description"
                name="description"
                placeholder="Describe your pool's strategy and unique value proposition"
                value={poolData.description}
                onChange={handleInputChange}
                rows={4}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Image/Video */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-white">Image or Video URL</Label>
              <Input 
                id="imageUrl"
                name="imageUrl"
                placeholder="Add a visual representation of your pool"
                value={poolData.imageUrl}
                onChange={handleInputChange}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {/* Network Selection */}
            <div className="space-y-2">
              <Label className="text-white">Select Network</Label>
              <Select 
                value={poolData.network}
                onValueChange={handleNetworkChange}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Choose a network" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {networks.map((network) => (
                    <SelectItem 
                      key={network.value} 
                      value={network.value}
                      className="hover:bg-slate-700"
                    >
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Social Links</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <Globe className="mr-2 h-4 w-4" /> Website
                  </Label>
                  <Input 
                    placeholder="https://yourpool.com"
                    value={poolData.socialLinks.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                  </Label>
                  <Input 
                    placeholder="@yourpool"
                    value={poolData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white flex items-center">
                    <Github className="mr-2 h-4 w-4" /> GitHub
                  </Label>
                  <Input 
                    placeholder="github.com/yourpool"
                    value={poolData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Create Pool
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePool;