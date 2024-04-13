'use client';
import { Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "../ui/command";
import TagComponent from "./tag";
import { PlusCircleIcon, TrashIcon, X } from "lucide-react";
import { toast } from "../ui/use-toast";
import { v4 } from "uuid";
import { deleteTag, getTagsForSubaccount, saveActivityLogsNotification, upsertTag } from "@/lib/queries";

type Props = {
  subAccountId: string;
  getSelectedTags: (tags: Tag[]) => void;
  defaultTags: Tag[]
}

const TagColors = ["BLUE", "ORANGE", "ROSE", "GREEN", "PURPLE"] as const;
export type TagColor = (typeof TagColors)[number];

const TagCreator: React.FC<Props> = ({ getSelectedTags, subAccountId, defaultTags }) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || []);
  const [tags, setTags] = useState<Tag[]>([]);
  const router = useRouter();
  const [value, setValue] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    getSelectedTags(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    if (subAccountId) {
      const fetchData = async () => {
        const response = await getTagsForSubaccount(subAccountId);
        if (response) setTags(response.Tags);
      }
      fetchData();
    }
  }, [subAccountId])

  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  }

  const handleAddTag = async () => {
    if (!value) {
      toast({
        variant: "destructive",
        title: "Tags need to have a name",
      });
      return;
    }

    if (!selectedColor) {
      toast({
        variant: "destructive",
        title: "Please select a color"
      })
      return;
    }

    const tagData: Tag = {
      color: selectedColor,
      createdAt: new Date(),
      id: v4(),
      name: value,
      subAccountId: subAccountId,
      updatedAt: new Date(),
    }

    setTags([...tags, tagData]);
    setValue('');
    setSelectedColor('');
    try {
      const response = await upsertTag(subAccountId, tagData);
      toast({ title: "Created the tag" });
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a tag | ${response.name}`,
        subaccountId: subAccountId,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not create the tag"
      })
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((t) => t.id !== tagId));
    try {
      const response = await deleteTag(tagId);
      toast({
        title: "Deleted Tag",
        description: "The tag is deleted from your subaccount."
      });

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a Tag | ${response.name}`,
        subaccountId: subAccountId,
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not delete the Tag",
      });
    }
  }

  const handleAddSelections = (tag: Tag) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  return (
    <Command className="bg-transparent max-h-[300px]">
      {!!selectedTags.length && (
        <div className="flex flex-wrap gap-2 p-2 bg-background border-2 border-border rounded-md">
          {selectedTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center"
            >
              <TagComponent
                title={tag.name}
                colorName={tag.color}
              />
              <X
                size={14}
                className="text-muted-foreground cursor-pointer"
                onClick={() => handleDeleteSelection(tag.id)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-row items-center gap-x-2 my-2">
        {TagColors.map((colorName) => (
          <TagComponent
            key={colorName}
            selected={selectedColor === colorName}
            selectedColor={setSelectedColor}
            title=""
            colorName={colorName}
          />
        ))}
      </div>
      <div className="relative">
        <CommandInput
          placeholder="Type a command or search..."
          value={value}
          onValueChange={setValue}
        />
        <PlusCircleIcon
          onClick={handleAddTag}
          size={20}
          className="absolute top-1/2 transform -translate-y-1/2 right-2 hover:text-primary transition-all cursor-pointer text-muted-foreground"
        />
      </div>
      <CommandList className="scroll-bar bg-secondary/25 border">
        <CommandSeparator />
        <CommandGroup heading="Tags">
          {tags.map((tag) => (
            <CommandItem
              key={tag.id}
              className="hover:!bg-secondary !bg-transparent flex items-center justify-between !font-light cursor-pointer"
            >
              <div onClick={() => handleAddSelections(tag)}>
                <TagComponent
                  title={tag.name}
                  colorName={tag.color}
                />
              </div>

              <AlertDialog>
                <AlertDialogTrigger>
                  <TrashIcon
                    size={16}
                    className="cursor-pointer text-muted-foreground hover:text-rose-400  transition-all"
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-left">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-left">
                      This action cannot be undone. This will permanently delete
                      your the tag and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="items-center">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandEmpty>No results found.</CommandEmpty>
      </CommandList>
    </Command>
  )
}

export default TagCreator
