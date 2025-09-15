import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Crown, Check, Zap, Shield, Users, CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const Payment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('samanyay_current_user');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  const validateForm = () => {
    const sanitizedNumber = cardNumber.replace(/\s+/g, "");
    const cardNumValid = /^\d{16}$/.test(sanitizedNumber);
    const nameValid = cardName.trim().length >= 2;
    const expiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry.trim());
    const cvcValid = /^\d{3,4}$/.test(cvc.trim());
    if (!nameValid) return "Enter the name on card.";
    if (!cardNumValid) return "Enter a valid 16-digit card number.";
    if (!expiryValid) return "Enter a valid expiry in MM/YY format.";
    if (!cvcValid) return "Enter a valid CVC.";
    return null;
  };

  const handlePayment = async () => {
    setLoading(true);
    setFormError(null);
    
    try {
      const validationMessage = validateForm();
      if (validationMessage) {
        throw new Error(validationMessage);
      }

      // Simulate gateway processing latency
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Randomize outcome for demo (80% success)
      const isSuccess = Math.random() < 0.8;

      if (!isSuccess) {
        throw new Error("Your bank declined the transaction. Try another card.");
      }

      // Create a fake receipt
      const last4 = cardNumber.replace(/\s+/g, "").slice(-4);
      const fakeTxnId = `txn_${Math.random().toString(36).slice(2, 10)}`;
      const nowIso = new Date().toISOString();
      const newReceipt = {
        id: fakeTxnId,
        amount: 99,
        currency: "USD",
        createdAt: nowIso,
        cardLast4: last4,
        plan: "Samanyay Pro (Monthly)"
      };

      // Call backend to mark Pro (and optionally process payment intent)
      await api.post('/payment/checkout', { amount: 9900, currency: 'usd' });

      // Update user to Pro status locally
      const updatedUser = { ...user, isPro: true };
      setUser(updatedUser);
      localStorage.setItem('samanyay_current_user', JSON.stringify(updatedUser));

      setReceipt(newReceipt);
      setPaymentStep(3);
      toast.success("Payment successful! Welcome to Samanyay Pro!");
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment failed. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const proFeatures = [
    {
      icon: <Zap className="h-5 w-5 text-warning" />,
      title: "Advanced AI Research",
      description: "Enhanced AI-powered legal research with deeper case analysis"
    },
    {
      icon: <Shield className="h-5 w-5 text-success" />,
      title: "Priority Security",
      description: "Advanced encryption and priority security monitoring"
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      title: "Team Collaboration", 
      description: "Collaborate with unlimited team members and clients"
    },
    {
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      title: "Premium Support",
      description: "24/7 priority customer support and dedicated account manager"
    }
  ];

  if (!user) return null;

  if (user.isPro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-elegant border-0 bg-gradient-card max-w-md w-full text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">You're Already Pro!</CardTitle>
            <CardDescription>
              You already have access to all premium features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-primary hover:shadow-glow"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl">Samanyay Pro</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        {paymentStep === 1 && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 bg-gradient-primary rounded-2xl flex items-center justify-center animate-float">
                  <Crown className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
                Upgrade to Samanyay Pro
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Unlock advanced AI-powered legal research tools and premium features designed for professional legal practice.
              </p>
            </div>

            {/* Pricing Card */}
            <div className="flex justify-center">
              <Card className="shadow-elegant border-2 border-primary/20 bg-gradient-card max-w-md w-full">
                <CardHeader className="text-center">
                  <div className="flex justify-center items-baseline space-x-2 mb-2">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <CardTitle className="text-2xl">Samanyay Pro</CardTitle>
                  <CardDescription>
                    Professional legal research platform with advanced AI tools
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {proFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
                      <Lock className="h-4 w-4" />
                      <span>Secure payment processing</span>
                    </div>
                    
                    <Button 
                      onClick={() => setPaymentStep(2)}
                      className="w-full bg-gradient-primary hover:shadow-glow transition-bounce text-lg py-6"
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      Upgrade to Pro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              {proFeatures.map((feature, index) => (
                <Card key={index} className="shadow-card bg-gradient-card border-0 hover-lift">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-accent rounded-lg">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {paymentStep === 2 && (
          <div className="max-w-md mx-auto animate-scale-in">
            <Card className="shadow-elegant border-0 bg-gradient-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Complete Payment</CardTitle>
                <CardDescription>
                  Secure payment processing powered by Stripe
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Alert className="border-primary/20 bg-primary/10">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-primary">
                    This is a demo environment. No real payment will be processed.
                  </AlertDescription>
                </Alert>

                {/* Mock Payment Form */}
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg bg-muted/30">
                    <h4 className="font-medium mb-3">Payment Summary</h4>
                    <div className="flex justify-between items-center">
                      <span>Samanyay Pro (Monthly)</span>
                      <span className="font-medium">$99.00</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Name on card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/[^\d]/g, "").slice(0,16);
                          const grouped = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                          setCardNumber(grouped);
                        }}
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Try 4242 4242 4242 4242</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          inputMode="numeric"
                          value={expiry}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/[^\d]/g, "").slice(0,4);
                            const formatted = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
                            setExpiry(formatted);
                          }}
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          inputMode="numeric"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, "").slice(0,4))}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {formError && (
                      <Alert className="border-destructive/20 bg-destructive/10">
                        <AlertDescription className="text-destructive text-sm">
                          {formError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full bg-gradient-primary hover:shadow-glow transition-bounce"
                    >
                      {loading ? (
                        "Processing Payment..."
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Pay $99.00
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => setPaymentStep(1)}
                      className="w-full"
                      disabled={loading}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {paymentStep === 3 && (
          <div className="max-w-md mx-auto text-center animate-scale-in">
            <Card className="shadow-elegant border-0 bg-gradient-card">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                    <Check className="h-10 w-10 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-success">Payment Successful!</CardTitle>
                <CardDescription>
                  Welcome to Samanyay Pro! Your account has been upgraded.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Alert className="border-success/20 bg-success/10">
                  <Crown className="h-4 w-4" />
                  <AlertDescription className="text-success">
                    You now have access to all premium features!
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 text-left">
                  {receipt && (
                    <div className="p-4 rounded-lg border border-border bg-background/40">
                      <h4 className="font-medium mb-2">Receipt</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between"><span>Transaction</span><span className="font-mono">{receipt.id}</span></div>
                        <div className="flex justify-between"><span>Date</span><span>{new Date(receipt.createdAt).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Plan</span><span>{receipt.plan}</span></div>
                        <div className="flex justify-between"><span>Amount</span><span>${receipt.amount.toFixed(2)} {receipt.currency}</span></div>
                        <div className="flex justify-between"><span>Card</span><span>**** **** **** {receipt.cardLast4}</span></div>
                      </div>
                    </div>
                  )}

                  {proFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 text-left">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      <span className="text-sm">{feature.title}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;