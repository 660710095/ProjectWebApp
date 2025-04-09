import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupForm() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setMessage("สมัครสมาชิกสำเร็จ!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-orange-100">
      <Card className="w-96 p-6 shadow-lg bg-orange-200 border-orange-400">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-orange-700">สมัครสมาชิก</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="name"
              placeholder="ชื่อ"
              value={formData.name}
              onChange={handleChange}
              className="border-orange-400 focus:ring-orange-500"
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={formData.email}
              onChange={handleChange}
              className="border-orange-400 focus:ring-orange-500"
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="รหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
              className="border-orange-400 focus:ring-orange-500"
              required
            />
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">สมัครสมาชิก</Button>
          </form>
          {message && <p className="mt-4 text-center text-orange-700">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}