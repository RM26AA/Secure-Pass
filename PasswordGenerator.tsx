import React, { useState, useCallback } from 'react';
import { Copy, RefreshCw, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface PasswordStrength {
  score: number;
  feedback: string[];
  label: string;
  color: string;
}

interface GenerationOptions {
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeLetters: boolean;
  includeSimilarChars: boolean;
}

const PasswordGenerator = () => {
  const [userPassword, setUserPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState([12]);
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerated, setShowGenerated] = useState(false);
  const [options, setOptions] = useState<GenerationOptions>({
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeLetters: true,
    includeSimilarChars: true,
  });
  const { toast } = useToast();

  const analyzePassword = useCallback((password: string): PasswordStrength => {
    if (!password) return { score: 0, feedback: [], label: 'No password', color: 'bg-gray-300' };

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else feedback.push('Use at least 8 characters (12+ recommended)');

    // Character variety checks
    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 15;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    else feedback.push('Include special characters (!@#$%^&*)');

    // Bonus points
    if (password.length >= 16) score += 10;
    if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 5;

    let label = 'Weak';
    let color = 'bg-red-500';

    if (score >= 85) {
      label = 'Very Strong';
      color = 'bg-green-500';
    } else if (score >= 70) {
      label = 'Strong';
      color = 'bg-green-400';
    } else if (score >= 50) {
      label = 'Moderate';
      color = 'bg-yellow-500';
    } else if (score >= 25) {
      label = 'Weak';
      color = 'bg-orange-500';
    }

    return { score: Math.min(score, 100), feedback, label, color };
  }, []);

  const improvePassword = useCallback((password: string): string => {
    let improved = password;
    const analysis = analyzePassword(password);

    // Add missing character types
    if (!/[a-z]/.test(improved)) improved += 'abc';
    if (!/[A-Z]/.test(improved)) improved += 'XYZ';
    if (!/\d/.test(improved)) improved += '123';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(improved)) improved += '!@#';

    // Ensure minimum length
    while (improved.length < 12) {
      improved += Math.random().toString(36).charAt(2);
    }

    // Shuffle the improved password
    return improved.split('').sort(() => Math.random() - 0.5).join('');
  }, [analyzePassword]);

  const generatePassword = useCallback((length: number, generationOptions: GenerationOptions): string => {
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*(),.?":{}|<>';
    
    // Remove similar characters if option is disabled
    if (!generationOptions.includeSimilarChars) {
      lowercase = lowercase.replace(/[il1o0]/g, '');
      uppercase = uppercase.replace(/[IL1O0]/g, '');
      numbers = numbers.replace(/[10]/g, '');
    }
    
    let availableChars = '';
    let requiredChars = '';
    
    // Build character sets based on options
    if (generationOptions.includeLowercase && generationOptions.includeLetters) {
      availableChars += lowercase;
      requiredChars += lowercase[Math.floor(Math.random() * lowercase.length)];
    }
    
    if (generationOptions.includeUppercase && generationOptions.includeLetters) {
      availableChars += uppercase;
      requiredChars += uppercase[Math.floor(Math.random() * uppercase.length)];
    }
    
    if (generationOptions.includeNumbers) {
      availableChars += numbers;
      requiredChars += numbers[Math.floor(Math.random() * numbers.length)];
    }
    
    if (generationOptions.includeSymbols) {
      availableChars += symbols;
      requiredChars += symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    // If no characters are available, use lowercase as fallback
    if (!availableChars) {
      availableChars = lowercase;
      requiredChars = lowercase[Math.floor(Math.random() * lowercase.length)];
    }
    
    let password = requiredChars;
    
    // Fill the rest randomly
    for (let i = requiredChars.length; i < length; i++) {
      password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(passwordLength[0], options);
    setGeneratedPassword(newPassword);
    toast({
      title: "Password Generated!",
      description: "Your new secure password is ready.",
    });
  };

  const handleImprovePassword = () => {
    if (!userPassword) {
      toast({
        title: "No Password Entered",
        description: "Please enter a password to improve.",
        variant: "destructive",
      });
      return;
    }
    const improved = improvePassword(userPassword);
    setGeneratedPassword(improved);
    toast({
      title: "Password Improved!",
      description: "Your password has been enhanced for better security.",
    });
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the password manually.",
        variant: "destructive",
      });
    }
  };

  const handleOptionChange = (option: keyof GenerationOptions, value: boolean) => {
    setOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const userPasswordStrength = analyzePassword(userPassword);
  const generatedPasswordStrength = analyzePassword(generatedPassword);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Password Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Check Your Password</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password to check its strength..."
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 h-8 w-8"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {userPassword && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(userPassword, "Password")}
                  className="p-2 h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {userPassword && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Strength: {userPasswordStrength.label}
                </span>
                <span className="text-sm text-gray-500">
                  {userPasswordStrength.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${userPasswordStrength.color}`}
                  style={{ width: `${userPasswordStrength.score}%` }}
                />
              </div>
              {userPasswordStrength.feedback.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Suggestions:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {userPasswordStrength.feedback.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Button 
                onClick={handleImprovePassword}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Improve This Password
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Password Generator Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Generate New Password</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Password Length
              </label>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {passwordLength[0]} characters
              </span>
            </div>
            <Slider
              value={passwordLength}
              onValueChange={setPasswordLength}
              max={64}
              min={6}
              step={1}
              className="w-full"
            />
          </div>

          {/* Generation Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Password Options</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Include Symbols</label>
                <Switch
                  checked={options.includeSymbols}
                  onCheckedChange={(checked) => handleOptionChange('includeSymbols', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Uppercase Letters</label>
                <Switch
                  checked={options.includeUppercase}
                  onCheckedChange={(checked) => handleOptionChange('includeUppercase', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Lowercase Letters</label>
                <Switch
                  checked={options.includeLowercase}
                  onCheckedChange={(checked) => handleOptionChange('includeLowercase', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Include Numbers</label>
                <Switch
                  checked={options.includeNumbers}
                  onCheckedChange={(checked) => handleOptionChange('includeNumbers', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Include Letters</label>
                <Switch
                  checked={options.includeLetters}
                  onCheckedChange={(checked) => handleOptionChange('includeLetters', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-600">Similar Characters</label>
                <Switch
                  checked={options.includeSimilarChars}
                  onCheckedChange={(checked) => handleOptionChange('includeSimilarChars', checked)}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGeneratePassword}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Secure Password
          </Button>
        </div>
      </div>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg p-6 border border-green-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your New Password</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showGenerated ? "text" : "password"}
                value={generatedPassword}
                readOnly
                className="pr-20 font-mono bg-white"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGenerated(!showGenerated)}
                  className="p-2 h-8 w-8"
                >
                  {showGenerated ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedPassword, "Generated password")}
                  className="p-2 h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Strength: {generatedPasswordStrength.label}
                </span>
                <span className="text-sm text-gray-500">
                  {generatedPasswordStrength.score}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${generatedPasswordStrength.color}`}
                  style={{ width: `${generatedPasswordStrength.score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
