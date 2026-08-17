import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="max-w-4xl px-4 sm:px-6 lg:px-8 py-10 mx-auto min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-8 bg-card border border-border p-1">
          <TabsTrigger value="account" className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground cursor-pointer">Account</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground cursor-pointer">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-muted data-[state=active]:text-foreground text-muted-foreground cursor-pointer">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Account Information</CardTitle>
              <CardDescription className="text-muted-foreground">Update your account details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">Name</Label>
                <Input id="name" defaultValue="John Doe" className="bg-muted border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-muted border-border text-foreground" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6">
              <Button className="bg-primary hover:bg-primary/90 text-white cursor-pointer">Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Notifications</CardTitle>
              <CardDescription className="text-muted-foreground">Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Email Notifications</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="marketing" className="rounded border-white/20 bg-muted accent-primary" defaultChecked />
                  <label htmlFor="marketing" className="text-sm font-medium text-foreground">Marketing emails</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="reminders" className="rounded border-white/20 bg-muted accent-primary" defaultChecked />
                  <label htmlFor="reminders" className="text-sm font-medium text-foreground">Reservation reminders</label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6">
              <Button className="bg-primary hover:bg-primary/90 text-white cursor-pointer">Update preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Security Settings</CardTitle>
              <CardDescription className="text-muted-foreground">Update your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-muted-foreground">Current Password</Label>
                <Input id="current-password" type="password" className="bg-muted border-border text-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-muted-foreground">New Password</Label>
                <Input id="new-password" type="password" className="bg-muted border-border text-foreground" />
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-6">
              <Button className="bg-primary hover:bg-primary/90 text-white cursor-pointer">Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
