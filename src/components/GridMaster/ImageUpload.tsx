"use client";

import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          <Upload className="h-4 w-4" />
          Upload Image
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" align="start">
        <DropdownMenuLabel>Image Upload</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} />
          {fileName && <p className="text-sm text-muted-foreground mt-2">Selected: {fileName}</p>}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};