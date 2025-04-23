
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const energyEntrySchema = z.object({
  period: z.string({
    required_error: "Please select a billing period",
  }),
  units: z.coerce.number({
    required_error: "Units consumed is required",
  }).positive({
    message: "Units must be a positive number",
  }),
  amount: z.coerce.number({
    required_error: "Bill amount is required",
  }).positive({
    message: "Amount must be a positive number",
  }),
});

const formSchema = z.object({
  communityId: z.string({
    required_error: "Please select a community",
  }),
  entries: z.array(energyEntrySchema).min(6, {
    message: "Please enter at least 6 billing periods",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Mock community data
const MOCK_COMMUNITIES = [
  { id: '1', name: 'Green Meadows Community' },
  { id: '2', name: 'Sunlit Apartments' },
];

// Tamil Nadu electricity billing periods
const BILLING_PERIODS = [
  "Jan-Feb 2023", "Mar-Apr 2023", "May-Jun 2023", 
  "Jul-Aug 2023", "Sep-Oct 2023", "Nov-Dec 2023",
  "Jan-Feb 2024", "Mar-Apr 2024"
];

const EnergyInput: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Form setup with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      communityId: '',
      entries: [
        { period: 'Jan-Feb 2023', units: undefined, amount: undefined },
        { period: 'Mar-Apr 2023', units: undefined, amount: undefined },
        { period: 'May-Jun 2023', units: undefined, amount: undefined },
        { period: 'Jul-Aug 2023', units: undefined, amount: undefined },
        { period: 'Sep-Oct 2023', units: undefined, amount: undefined },
        { period: 'Nov-Dec 2023', units: undefined, amount: undefined },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call to save energy data
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Energy data saved successfully!',
        description: 'Your consumption data has been recorded for the community.',
      });
      
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: 'Failed to save energy data',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Data Submitted Successfully</CardTitle>
            <CardDescription>
              Thank you for providing your energy consumption information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-green-50 p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-medium text-green-800 mb-2">Energy Data Recorded</h3>
              <p className="text-green-700">
                Your energy consumption data has been successfully recorded and will help in calculating the optimal solar setup for your community.
              </p>
            </div>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                When all community members have submitted their data, your community admin can request quotes from solar providers.
              </p>
              <div className="pt-2">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-solar-blue text-white hover:bg-solar-blue/90"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        ← Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Energy Consumption Data</CardTitle>
          <CardDescription>
            Enter your electricity consumption details for the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Community</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your community" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_COMMUNITIES.map(community => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the community for which you're providing energy data
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Billing Information</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Enter your electricity bill details for each bi-monthly period
                  </p>
                </div>
                
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-md">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.period`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Billing Period</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {BILLING_PERIODS.map(period => (
                                  <SelectItem key={period} value={period}>
                                    {period}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`entries.${index}.units`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Units Consumed (kWh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 350" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`entries.${index}.amount`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Bill Amount (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="e.g., 1500" 
                                {...field}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {index >= 6 && (
                        <div className="flex items-end mb-1">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-destructive border-destructive hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {fields.length < BILLING_PERIODS.length && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      append({
                        period: BILLING_PERIODS[fields.length],
                        units: undefined,
                        amount: undefined
                      });
                    }}
                  >
                    Add Another Billing Period
                  </Button>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-solar-yellow text-foreground hover:bg-solar-orange"
                disabled={isLoading}
              >
                {isLoading ? 'Saving Data...' : 'Save Energy Data'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnergyInput;
