"use client";

import React, { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  onImageUpload: (imageSrc: string | null) => void;
}

export const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [fileName, setFileName] = useState<string>("");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("");
      onImageUpload(null);
    }
  };

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-xl">Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} />
          {fileName && <p className="text-sm text-muted-foreground mt-2">Selected: {fileName}</p>}
        </div>
      </CardContent>
    </Card>
  );
};