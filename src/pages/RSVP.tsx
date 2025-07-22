import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const RSVP = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    surname: '',
    attendance: '',
    guestCount: '1',
    guestNames: '',
    songRequest: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://yptjhzawttwkaiacpnpc.supabase.co/functions/v1/send-rsvp-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          surname: formData.surname,
          attendance: formData.attendance,
          guestCount: formData.guestCount,
          guestNames: formData.guestNames,
          songRequest: formData.songRequest
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Siyabonga! (Thank you!)",
          description: formData.attendance === 'no' 
            ? "We're sorry you can't make it, but we appreciate you letting us know!" 
            : "Your RSVP has been submitted successfully!",
        });
        
        setFormData({
          fullName: '',
          surname: '',
          attendance: '',
          guestCount: '1',
          guestNames: '',
          songRequest: ''
        });
      } else {
        throw new Error(result.error || 'Failed to submit RSVP');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast({
        title: "Error",
        description: "There was an issue submitting your RSVP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-5xl font-bold text-brown mb-4">
              RSVP
            </h1>
            <p className="text-lg text-brown/80 mb-4">
              We would be honored by your presence at our special day
            </p>
            <div className="bg-terracotta/10 border border-terracotta/30 rounded-lg p-4 mb-6">
              <p className="text-terracotta font-semibold text-lg">
                ⏰ RSVP Deadline: 31 August 2025
              </p>
              <p className="text-brown/70 text-sm mt-1">
                Please respond by this date to help us with our planning
              </p>
            </div>
            <div className="geometric-divider w-24 mx-auto mt-6"></div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-brown font-semibold">
                Full Name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="mt-1 border-sand focus:border-terracotta"
              />
            </div>

            {/* Surname */}
            <div>
              <Label htmlFor="surname" className="text-brown font-semibold">
                Surname *
              </Label>
              <Input
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                required
                className="mt-1 border-sand focus:border-terracotta"
              />
            </div>

            {/* Attendance */}
            <div>
              <Label className="text-brown font-semibold">Will you be attending? *</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="attending-yes"
                    name="attendance"
                    value="yes"
                    checked={formData.attendance === 'yes'}
                    onChange={handleInputChange}
                    className="text-terracotta focus:ring-terracotta"
                  />
                  <label htmlFor="attending-yes" className="text-brown">
                    Yes, I'll be there! 🎉
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="attending-no"
                    name="attendance"
                    value="no"
                    checked={formData.attendance === 'no'}
                    onChange={handleInputChange}
                    className="text-terracotta focus:ring-terracotta"
                  />
                  <label htmlFor="attending-no" className="text-brown">
                    No, I can't attend 😢
                  </label>
                </div>
              </div>
            </div>

            {/* Number of Guests */}
            {formData.attendance === 'yes' && (
              <>
                <div>
                  <Label htmlFor="guestCount" className="text-brown font-semibold">
                    Number of Guests Coming
                  </Label>
                  <select
                    id="guestCount"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestCount: e.target.value }))}
                    className="mt-1 w-full border border-sand rounded-md p-2 focus:border-terracotta focus:outline-none"
                  >
                    <option value="1">1 guest coming</option>
                    <option value="2">2 guests coming</option>
                    <option value="3">3 guests coming</option>
                    <option value="4">4 guests coming</option>
                    <option value="5">5 guests coming</option>
                    <option value="6">6 guests coming</option>
                  </select>
                </div>

                {/* Guest Names */}
                {parseInt(formData.guestCount) > 1 && (
                  <div>
                    <Label htmlFor="guestNames" className="text-brown font-semibold">
                      Guest Names
                    </Label>
                    <Textarea
                      id="guestNames"
                      name="guestNames"
                      value={formData.guestNames}
                      onChange={handleInputChange}
                      placeholder="Please enter the names of your guests"
                      className="mt-1 border-sand focus:border-terracotta"
                      rows={3}
                    />
                  </div>
                )}

                {/* Song Request */}
                <div>
                  <Label htmlFor="songRequest" className="text-brown font-semibold">
                    Song Request (optional)
                  </Label>
                  <Textarea
                    id="songRequest"
                    name="songRequest"
                    value={formData.songRequest}
                    onChange={handleInputChange}
                    placeholder="Any special song you'd like us to play at the reception?"
                    className="mt-1 border-sand focus:border-terracotta"
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={!formData.fullName || !formData.surname || !formData.attendance || isLoading}
                className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-semibold py-3 text-lg"
              >
                {isLoading ? 'Processing...' : 'Send RSVP'}
              </Button>
            </div>
          </form>

          <div className="text-center mt-8 p-6 bg-white/50 rounded-lg">
            <p className="text-brown/80">
              Questions? Contact us at{' '}
              <a href="mailto:dimphoparkies@gmail.com" className="text-terracotta hover:underline">
                dimphoparkies@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RSVP;
