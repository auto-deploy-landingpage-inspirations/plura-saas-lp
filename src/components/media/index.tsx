import { GetMediaFiles } from "@/lib/types";
import React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import MediaUploadButton from "./upload-button";
import MediaCard from "./media-card";
import { FolderSearch } from "lucide-react";

type Props = {
  data: GetMediaFiles;
  subaccountId: string;
}

const MediaComponent: React.FC<Props> = ({ data, subaccountId }) => {
  return (
    <div className="flex flex-col h-full w-full gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton subaccountId={subaccountId} />
      </div>

      <Command className="bg-transparent">
        <CommandInput placeholder="Search media files" />
        <CommandList className="pb-40 max-h-full">
          <CommandEmpty>No media files.</CommandEmpty>
          <CommandGroup>
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media.map((file) => (
                <CommandItem
                  key={file.id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch size={200} className="dark:text-muted text-slate-300" />
                  <p className="text-muted-foreground">Empty! no files to show.</p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export default MediaComponent
