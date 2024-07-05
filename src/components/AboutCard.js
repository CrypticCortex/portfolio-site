import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import Link from "next/link";
import GitHubIcon from "@/components/icons/GitlabIcon";
import LinkedinIcon from "@/components/icons/LinkedinIcon";

const AboutCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About me</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border">
            <AvatarImage src="/public/Profile.png" />
            <AvatarFallback />
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">Kalyan</div>
            <div className="text-muted-foreground text-sm">AI Researcher</div>
          </div>
        </div>
        <p className="mt-4 text-muted-foreground">
          Kalyan is a 4th-year undergraduate at Amrita University with a keen interest in computer vision and visual learning models. He enjoys turning ideas into applications using Flutter and is actively involved in research, particularly focusing on VLMS and CV.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <Link href="#">
            <GitHubIcon className="w-5 h-5" />
          </Link>
          <Link href="#">
            <LinkedinIcon className="w-5 h-5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutCard;