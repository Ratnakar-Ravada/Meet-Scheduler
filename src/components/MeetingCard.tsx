
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MeetingCardProps {
  title: string;
  description?: string;
  meetingLink?: string;
  meetingTime?: string;
  className?: string;
  children?: React.ReactNode;
  isGenerating?: boolean;
}

const MeetingCard = ({
  title,
  description,
  meetingLink,
  meetingTime,
  className,
  children,
  isGenerating = false,
}: MeetingCardProps) => {

  const copyToClipboard = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      toast.success('Meeting link copied to clipboard!');
    }
  };

  return (
    <Card className={cn("w-full overflow-hidden animate-fade-in shadow-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        {children}

        {meetingLink && (
          <div className="mt-4 space-y-4">
            {meetingTime && (
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground mb-1">Scheduled for</span>
                <span className="font-medium">{meetingTime}</span>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground mb-1">Meeting link</span>
              <div className="flex items-center">
                <div className="bg-secondary py-2 px-3 rounded-l-md text-sm font-medium flex-1 truncate border-y border-l">
                  {meetingLink}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={copyToClipboard}
                  className="rounded-l-none h-9 border-y border-r"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="mt-6 flex flex-col items-center justify-center py-4">
            <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin mb-3"></div>
            <p className="text-sm text-muted-foreground">Generating your meeting link...</p>
          </div>
        )}
      </CardContent>

      {meetingLink && (
        <CardFooter className="pt-2">
          <Button variant="outline" size="sm" className="w-full button-hover" asChild>
            <a href={meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
              Join meeting
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MeetingCard;
