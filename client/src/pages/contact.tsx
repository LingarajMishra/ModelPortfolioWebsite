import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Instagram, Twitter } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@modelportfolio.com",
      link: "mailto:contact@modelportfolio.com"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: Instagram,
      title: "Instagram",
      value: "@modelportfolio",
      link: "https://instagram.com/modelportfolio"
    },
    {
      icon: Twitter,
      title: "Twitter",
      value: "@modelportfolio",
      link: "https://twitter.com/modelportfolio"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
        <p className="text-muted-foreground">
          Available for bookings and collaborations
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contactInfo.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <item.icon className="h-6 w-6" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href={item.link}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.value}
                </a>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
