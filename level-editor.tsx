import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Trash2, Save, Edit, Copy, File, FileText, Play, Import, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define types for our mystery elements
interface MysteryClue {
  id: string;
  content: string;
  type: "text" | "image" | "audio" | "document";
  locationId?: string;
  hidden: boolean;
  requiresItem?: string;
}

interface MysteryLocation {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  connectedLocations: string[];
}

interface MysteryCharacter {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  defaultLocationId: string;
  dialogues: MysteryDialogue[];
}

interface MysteryDialogue {
  id: string;
  text: string;
  responseOptions?: MysteryDialogueResponse[];
  condition?: {
    type: "hasClue" | "hasItem" | "visitedLocation";
    targetId: string;
  };
}

interface MysteryDialogueResponse {
  id: string;
  text: string;
  leadsTo?: string; // ID of next dialogue
  givesClue?: string; // ID of clue to give
  givesItem?: string; // ID of item to give
}

interface MysteryItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  locationId?: string; // Where it can be found
  hidden: boolean;
  usableWith?: string; // ID of another item or location it can be used with
}

interface Mystery {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: number; // in minutes
  locations: MysteryLocation[];
  characters: MysteryCharacter[];
  clues: MysteryClue[];
  items: MysteryItem[];
  startingLocationId: string;
  objectives: string[];
  solution: string;
}

// Create a new empty mystery template
const createEmptyMystery = (): Mystery => ({
  id: `mystery-${Date.now()}`,
  title: "New Mystery",
  description: "A brand new mystery adventure",
  difficulty: "medium",
  estimatedTime: 60,
  locations: [],
  characters: [],
  clues: [],
  items: [],
  startingLocationId: "",
  objectives: ["Solve the mystery"],
  solution: "The solution to the mystery",
});

// Generate IDs for new elements
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function LevelEditorPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [mystery, setMystery] = useState<Mystery>(createEmptyMystery());
  const [savedMysteries, setSavedMysteries] = useState<Mystery[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<"location" | "character" | "clue" | "item" | null>(null);
  
  // For handling editing dialogs
  const [editDialogData, setEditDialogData] = useState<any>({});
  
  // For preview
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Save the current mystery
  const saveMystery = () => {
    if (!mystery.title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please add a title for your mystery before saving.",
        variant: "destructive",
      });
      return;
    }

    // Check if we're updating an existing mystery
    const existingIndex = savedMysteries.findIndex(m => m.id === mystery.id);
    
    if (existingIndex >= 0) {
      const updatedMysteries = [...savedMysteries];
      updatedMysteries[existingIndex] = {...mystery};
      setSavedMysteries(updatedMysteries);
    } else {
      setSavedMysteries([...savedMysteries, {...mystery}]);
    }
    
    toast({
      title: "Mystery Saved",
      description: `"${mystery.title}" has been saved.`,
    });
  };

  // Load a saved mystery
  const loadMystery = (mysteryId: string) => {
    const foundMystery = savedMysteries.find(m => m.id === mysteryId);
    if (foundMystery) {
      setMystery({...foundMystery});
      toast({
        title: "Mystery Loaded",
        description: `"${foundMystery.title}" has been loaded for editing.`,
      });
    }
  };

  // Create a new mystery
  const createNewMystery = () => {
    setMystery(createEmptyMystery());
    setActiveTab("details");
  };
  
  // Handle adding a new location
  const addLocation = () => {
    const newLocation: MysteryLocation = {
      id: generateId("location"),
      name: "New Location",
      description: "Description of this location",
      connectedLocations: [],
    };
    
    setEditType("location");
    setCurrentEditingItem(newLocation);
    setEditDialogData(newLocation);
    setIsEditDialogOpen(true);
  };
  
  // Handle adding a new character
  const addCharacter = () => {
    const newCharacter: MysteryCharacter = {
      id: generateId("character"),
      name: "New Character",
      description: "Description of this character",
      defaultLocationId: mystery.locations.length > 0 ? mystery.locations[0].id : "",
      dialogues: [],
    };
    
    setEditType("character");
    setCurrentEditingItem(newCharacter);
    setEditDialogData(newCharacter);
    setIsEditDialogOpen(true);
  };
  
  // Handle adding a new clue
  const addClue = () => {
    const newClue: MysteryClue = {
      id: generateId("clue"),
      content: "This is a clue",
      type: "text",
      hidden: true,
      locationId: mystery.locations.length > 0 ? mystery.locations[0].id : "",
    };
    
    setEditType("clue");
    setCurrentEditingItem(newClue);
    setEditDialogData(newClue);
    setIsEditDialogOpen(true);
  };
  
  // Handle adding a new item
  const addItem = () => {
    const newItem: MysteryItem = {
      id: generateId("item"),
      name: "New Item",
      description: "Description of this item",
      hidden: true,
      locationId: mystery.locations.length > 0 ? mystery.locations[0].id : "",
    };
    
    setEditType("item");
    setCurrentEditingItem(newItem);
    setEditDialogData(newItem);
    setIsEditDialogOpen(true);
  };

  // Handle saving edited item from dialog
  const saveEditedItem = () => {
    if (!editType || !currentEditingItem) return;
    
    let updatedMystery = {...mystery};
    
    switch(editType) {
      case "location":
        // Check if we're editing an existing location or adding a new one
        if (mystery.locations.some(loc => loc.id === currentEditingItem.id)) {
          updatedMystery.locations = mystery.locations.map(loc => 
            loc.id === currentEditingItem.id ? {...editDialogData as MysteryLocation} : loc
          );
        } else {
          updatedMystery.locations = [...mystery.locations, editDialogData as MysteryLocation];
          
          // If this is the first location, set it as the starting location
          if (mystery.locations.length === 0) {
            updatedMystery.startingLocationId = (editDialogData as MysteryLocation).id;
          }
        }
        break;
        
      case "character":
        if (mystery.characters.some(char => char.id === currentEditingItem.id)) {
          updatedMystery.characters = mystery.characters.map(char => 
            char.id === currentEditingItem.id ? {...editDialogData as MysteryCharacter} : char
          );
        } else {
          updatedMystery.characters = [...mystery.characters, editDialogData as MysteryCharacter];
        }
        break;
        
      case "clue":
        if (mystery.clues.some(clue => clue.id === currentEditingItem.id)) {
          updatedMystery.clues = mystery.clues.map(clue => 
            clue.id === currentEditingItem.id ? {...editDialogData as MysteryClue} : clue
          );
        } else {
          updatedMystery.clues = [...mystery.clues, editDialogData as MysteryClue];
        }
        break;
        
      case "item":
        if (mystery.items.some(item => item.id === currentEditingItem.id)) {
          updatedMystery.items = mystery.items.map(item => 
            item.id === currentEditingItem.id ? {...editDialogData as MysteryItem} : item
          );
        } else {
          updatedMystery.items = [...mystery.items, editDialogData as MysteryItem];
        }
        break;
    }
    
    setMystery(updatedMystery);
    setIsEditDialogOpen(false);
    setCurrentEditingItem(null);
    setEditDialogData({});
    
    toast({
      title: "Item Saved",
      description: `The ${editType} has been saved to your mystery.`,
    });
  };

  // Handle editing an existing item
  const editItem = (type: "location" | "character" | "clue" | "item", id: string) => {
    let item;
    
    switch(type) {
      case "location":
        item = mystery.locations.find(loc => loc.id === id);
        break;
      case "character":
        item = mystery.characters.find(char => char.id === id);
        break;
      case "clue":
        item = mystery.clues.find(clue => clue.id === id);
        break;
      case "item":
        item = mystery.items.find(i => i.id === id);
        break;
    }
    
    if (item) {
      setEditType(type);
      setCurrentEditingItem(item);
      setEditDialogData({...item});
      setIsEditDialogOpen(true);
    }
  };

  // Handle removing an item
  const removeItem = (type: "location" | "character" | "clue" | "item", id: string) => {
    let updatedMystery = {...mystery};
    
    switch(type) {
      case "location":
        updatedMystery.locations = mystery.locations.filter(loc => loc.id !== id);
        // If we removed the starting location, update it
        if (mystery.startingLocationId === id && updatedMystery.locations.length > 0) {
          updatedMystery.startingLocationId = updatedMystery.locations[0].id;
        }
        break;
      case "character":
        updatedMystery.characters = mystery.characters.filter(char => char.id !== id);
        break;
      case "clue":
        updatedMystery.clues = mystery.clues.filter(clue => clue.id !== id);
        break;
      case "item":
        updatedMystery.items = mystery.items.filter(item => item.id !== id);
        break;
    }
    
    setMystery(updatedMystery);
    toast({
      title: "Item Removed",
      description: `The ${type} has been removed from your mystery.`,
    });
  };

  // Handle changes to the main mystery details
  const handleMysteryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMystery({
      ...mystery,
      [name]: value,
    });
  };

  // Handle objective changes
  const handleObjectiveChange = (index: number, value: string) => {
    const updatedObjectives = [...mystery.objectives];
    updatedObjectives[index] = value;
    setMystery({
      ...mystery,
      objectives: updatedObjectives,
    });
  };

  // Add new objective
  const addObjective = () => {
    setMystery({
      ...mystery,
      objectives: [...mystery.objectives, "New objective"],
    });
  };

  // Remove an objective
  const removeObjective = (index: number) => {
    const updatedObjectives = [...mystery.objectives];
    updatedObjectives.splice(index, 1);
    setMystery({
      ...mystery,
      objectives: updatedObjectives,
    });
  };

  // Handle dialog form changes
  const handleDialogDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditDialogData({
      ...editDialogData,
      [name]: value,
    });
  };

  // Export mystery to JSON
  const exportMystery = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mystery, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${mystery.title.replace(/\s+/g, '_')}_mystery.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mystery Level Editor</h1>
          <p className="text-muted-foreground mt-1">Create and edit custom mystery adventures</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={createNewMystery}>
            <Plus className="w-4 h-4 mr-2" /> New Mystery
          </Button>
          <Button onClick={saveMystery}>
            <Save className="w-4 h-4 mr-2" /> Save Mystery
          </Button>
          <Button variant="outline" onClick={exportMystery}>
            <Share2 className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with saved mysteries */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Saved Mysteries</CardTitle>
              <CardDescription>Your custom mysteries</CardDescription>
            </CardHeader>
            <CardContent>
              {savedMysteries.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No saved mysteries yet</p>
                  <p className="text-xs mt-1">Create your first mystery!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedMysteries.map(savedMystery => (
                    <div 
                      key={savedMystery.id} 
                      className="p-3 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => loadMystery(savedMystery.id)}
                    >
                      <div className="font-medium">{savedMystery.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {savedMystery.locations.length} locations • {savedMystery.characters.length} characters
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                <Input 
                  name="title"
                  value={mystery.title}
                  onChange={handleMysteryChange}
                  className="text-xl font-bold p-0 border-0 focus:ring-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Mystery Title"
                />
              </CardTitle>
              <CardDescription>
                <Textarea 
                  name="description"
                  value={mystery.description}
                  onChange={handleMysteryChange}
                  className="resize-none mt-1 border-0 focus:ring-0 p-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Mystery Description"
                />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="locations">Locations</TabsTrigger>
                  <TabsTrigger value="characters">Characters</TabsTrigger>
                  <TabsTrigger value="clues">Clues</TabsTrigger>
                  <TabsTrigger value="items">Items</TabsTrigger>
                </TabsList>

                {/* Details tab */}
                <TabsContent value="details">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select 
                            name="difficulty" 
                            value={mystery.difficulty}
                            onValueChange={(value) => setMystery({...mystery, difficulty: value as any})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                          <Input 
                            type="number" 
                            name="estimatedTime"
                            value={mystery.estimatedTime}
                            onChange={(e) => setMystery({...mystery, estimatedTime: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        
                        {mystery.locations.length > 0 && (
                          <div>
                            <Label htmlFor="startingLocationId">Starting Location</Label>
                            <Select 
                              name="startingLocationId" 
                              value={mystery.startingLocationId}
                              onValueChange={(value) => setMystery({...mystery, startingLocationId: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select starting location" />
                              </SelectTrigger>
                              <SelectContent>
                                {mystery.locations.map(location => (
                                  <SelectItem key={location.id} value={location.id}>
                                    {location.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Label>Objectives</Label>
                        <div className="space-y-2 mt-2">
                          {mystery.objectives.map((objective, index) => (
                            <div key={index} className="flex gap-2">
                              <Input 
                                value={objective}
                                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                placeholder="Objective"
                              />
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeObjective(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={addObjective} className="mt-2">
                            <Plus className="h-4 w-4 mr-2" /> Add Objective
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="solution">Solution</Label>
                      <Textarea 
                        name="solution"
                        value={mystery.solution}
                        onChange={handleMysteryChange}
                        placeholder="Describe the solution to your mystery"
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Locations tab */}
                <TabsContent value="locations">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Locations</h3>
                      <Button size="sm" onClick={addLocation}>
                        <Plus className="h-4 w-4 mr-2" /> Add Location
                      </Button>
                    </div>
                    
                    {mystery.locations.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">No locations added yet</p>
                        <Button variant="outline" size="sm" onClick={addLocation} className="mt-2">
                          <Plus className="h-4 w-4 mr-2" /> Add Your First Location
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mystery.locations.map(location => (
                          <Card key={location.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{location.name}</CardTitle>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => editItem("location", location.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => removeItem("location", location.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {location.id === mystery.startingLocationId && (
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Starting Location</div>
                              )}
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2">{location.description}</p>
                              
                              {location.connectedLocations.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium mb-1">Connected to:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {location.connectedLocations.map(connId => {
                                      const connLocation = mystery.locations.find(l => l.id === connId);
                                      return connLocation ? (
                                        <span key={connId} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                          {connLocation.name}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Characters tab */}
                <TabsContent value="characters">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Characters</h3>
                      <Button size="sm" onClick={addCharacter}>
                        <Plus className="h-4 w-4 mr-2" /> Add Character
                      </Button>
                    </div>
                    
                    {mystery.characters.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">No characters added yet</p>
                        <Button variant="outline" size="sm" onClick={addCharacter} className="mt-2">
                          <Plus className="h-4 w-4 mr-2" /> Add Your First Character
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mystery.characters.map(character => (
                          <Card key={character.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{character.name}</CardTitle>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => editItem("character", character.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => removeItem("character", character.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2">{character.description}</p>
                              
                              <div className="mt-2">
                                <p className="text-xs font-medium mb-1">Located at:</p>
                                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                  {mystery.locations.find(l => l.id === character.defaultLocationId)?.name || "Unknown location"}
                                </span>
                              </div>
                              
                              <div className="mt-2">
                                <p className="text-xs font-medium mb-1">Dialogues:</p>
                                <span className="text-xs">
                                  {character.dialogues.length} dialogue options
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Clues tab */}
                <TabsContent value="clues">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Clues</h3>
                      <Button size="sm" onClick={addClue}>
                        <Plus className="h-4 w-4 mr-2" /> Add Clue
                      </Button>
                    </div>
                    
                    {mystery.clues.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">No clues added yet</p>
                        <Button variant="outline" size="sm" onClick={addClue} className="mt-2">
                          <Plus className="h-4 w-4 mr-2" /> Add Your First Clue
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mystery.clues.map(clue => (
                          <Card key={clue.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${clue.hidden ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                  <CardTitle className="text-base">Clue #{clue.id.split('-')[1]}</CardTitle>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => editItem("clue", clue.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => removeItem("clue", clue.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-xs">
                                Type: {clue.type.charAt(0).toUpperCase() + clue.type.slice(1)}
                                {clue.hidden && <span className="text-red-500 ml-2">Hidden</span>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm line-clamp-2">{clue.content}</p>
                              
                              <div className="mt-2">
                                <p className="text-xs font-medium mb-1">Located at:</p>
                                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                  {mystery.locations.find(l => l.id === clue.locationId)?.name || "Unknown location"}
                                </span>
                              </div>
                              
                              {clue.requiresItem && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium mb-1">Requires item:</p>
                                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                    {mystery.items.find(i => i.id === clue.requiresItem)?.name || "Unknown item"}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Items tab */}
                <TabsContent value="items">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Items</h3>
                      <Button size="sm" onClick={addItem}>
                        <Plus className="h-4 w-4 mr-2" /> Add Item
                      </Button>
                    </div>
                    
                    {mystery.items.length === 0 ? (
                      <div className="text-center p-8 border border-dashed rounded-lg">
                        <p className="text-muted-foreground">No items added yet</p>
                        <Button variant="outline" size="sm" onClick={addItem} className="mt-2">
                          <Plus className="h-4 w-4 mr-2" /> Add Your First Item
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mystery.items.map(item => (
                          <Card key={item.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${item.hidden ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                  <CardTitle className="text-base">{item.name}</CardTitle>
                                </div>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="icon" onClick={() => editItem("item", item.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => removeItem("item", item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {item.hidden && <div className="text-xs text-red-500">Hidden</div>}
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                              
                              <div className="mt-2">
                                <p className="text-xs font-medium mb-1">Located at:</p>
                                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                  {mystery.locations.find(l => l.id === item.locationId)?.name || "Unknown location"}
                                </span>
                              </div>
                              
                              {item.usableWith && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium mb-1">Can be used with:</p>
                                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                                    {mystery.items.find(i => i.id === item.usableWith)?.name || 
                                     mystery.locations.find(l => l.id === item.usableWith)?.name || 
                                     "Unknown object"}
                                  </span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setIsPreviewMode(true)}>
                <Play className="w-4 h-4 mr-2" /> Preview Mystery
              </Button>
              <Button onClick={saveMystery}>
                <Save className="w-4 h-4 mr-2" /> Save Mystery
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Edit Dialog for locations, characters, clues and items */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentEditingItem && mystery[`${editType}s`]?.some(item => item.id === currentEditingItem.id) 
                ? `Edit ${editType}` 
                : `Add new ${editType}`}
            </DialogTitle>
            <DialogDescription>
              {editType === "location" && "Define the location details for your mystery."}
              {editType === "character" && "Create a character that players can interact with."}
              {editType === "clue" && "Add a clue that will help solve the mystery."}
              {editType === "item" && "Add an item that players can find and use."}
            </DialogDescription>
          </DialogHeader>
          
          {editType === "location" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Location Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={editDialogData.name || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={editDialogData.description || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Describe this location"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  value={editDialogData.imageUrl || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Enter image URL for this location"
                />
              </div>
              <div>
                <Label>Connected Locations</Label>
                {mystery.locations.length > 1 ? (
                  <div className="space-y-2 mt-2">
                    {mystery.locations
                      .filter(loc => loc.id !== editDialogData.id)
                      .map(loc => (
                        <div key={loc.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`connection-${loc.id}`}
                            checked={editDialogData.connectedLocations?.includes(loc.id) || false}
                            onChange={(e) => {
                              const connections = editDialogData.connectedLocations || [];
                              setEditDialogData({
                                ...editDialogData,
                                connectedLocations: e.target.checked 
                                  ? [...connections, loc.id] 
                                  : connections.filter(id => id !== loc.id)
                              });
                            }}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`connection-${loc.id}`} className="text-sm font-normal">
                            {loc.name}
                          </Label>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Add more locations to create connections between them.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {editType === "character" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Character Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={editDialogData.name || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Enter character name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={editDialogData.description || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Describe this character"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  value={editDialogData.imageUrl || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Enter image URL for this character"
                />
              </div>
              <div>
                <Label htmlFor="defaultLocationId">Default Location</Label>
                {mystery.locations.length > 0 ? (
                  <Select 
                    name="defaultLocationId"
                    value={editDialogData.defaultLocationId || ""}
                    onValueChange={(value) => setEditDialogData({...editDialogData, defaultLocationId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {mystery.locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Add locations first to assign this character to a location.
                  </p>
                )}
              </div>
              {/* Simplified dialogues interface - would be expanded in a real implementation */}
              <div>
                <Label>Dialogues</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Character dialogues can be edited in a dedicated dialogue editor (coming soon).
                </p>
              </div>
            </div>
          )}
          
          {editType === "clue" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Clue Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={editDialogData.content || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Enter the clue content"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="type">Clue Type</Label>
                <Select 
                  name="type"
                  value={editDialogData.type || "text"}
                  onValueChange={(value) => setEditDialogData({...editDialogData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="locationId">Location</Label>
                {mystery.locations.length > 0 ? (
                  <Select 
                    name="locationId"
                    value={editDialogData.locationId || ""}
                    onValueChange={(value) => setEditDialogData({...editDialogData, locationId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {mystery.locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Add locations first to place this clue.
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hidden"
                  checked={editDialogData.hidden || false}
                  onChange={(e) => setEditDialogData({...editDialogData, hidden: e.target.checked})}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="hidden" className="text-sm font-normal">
                  Hidden (requires special action to discover)
                </Label>
              </div>
              <div>
                <Label htmlFor="requiresItem">Requires Item (optional)</Label>
                {mystery.items.length > 0 ? (
                  <Select 
                    name="requiresItem"
                    value={editDialogData.requiresItem || ""}
                    onValueChange={(value) => setEditDialogData({...editDialogData, requiresItem: value || undefined})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {mystery.items.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Add items first to require an item for this clue.
                  </p>
                )}
              </div>
            </div>
          )}
          
          {editType === "item" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={editDialogData.name || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={editDialogData.description || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Describe this item"
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input 
                  id="imageUrl" 
                  name="imageUrl" 
                  value={editDialogData.imageUrl || ""} 
                  onChange={handleDialogDataChange}
                  placeholder="Enter image URL for this item"
                />
              </div>
              <div>
                <Label htmlFor="locationId">Location</Label>
                {mystery.locations.length > 0 ? (
                  <Select 
                    name="locationId"
                    value={editDialogData.locationId || ""}
                    onValueChange={(value) => setEditDialogData({...editDialogData, locationId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {mystery.locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Add locations first to place this item.
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="hidden"
                  checked={editDialogData.hidden || false}
                  onChange={(e) => setEditDialogData({...editDialogData, hidden: e.target.checked})}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="hidden" className="text-sm font-normal">
                  Hidden (requires special action to discover)
                </Label>
              </div>
              <div>
                <Label htmlFor="usableWith">Can be used with (optional)</Label>
                <Select 
                  name="usableWith"
                  value={editDialogData.usableWith || ""}
                  onValueChange={(value) => setEditDialogData({...editDialogData, usableWith: value || undefined})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interaction (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="__group_items" disabled>
                      Items
                    </SelectItem>
                    {mystery.items
                      .filter(item => item.id !== editDialogData.id)
                      .map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))
                    }
                    <SelectItem value="__group_locations" disabled>
                      Locations
                    </SelectItem>
                    {mystery.locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveEditedItem}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mystery Preview Dialog */}
      {isPreviewMode && (
        <Dialog open={isPreviewMode} onOpenChange={setIsPreviewMode}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Mystery Preview: {mystery.title}</DialogTitle>
              <DialogDescription>
                This is how your mystery will appear to players
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p>{mystery.description}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Objectives</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {mystery.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Starting Location</h3>
                {mystery.startingLocationId ? (
                  <div className="p-4 border rounded-md">
                    <h4 className="font-medium">
                      {mystery.locations.find(loc => loc.id === mystery.startingLocationId)?.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {mystery.locations.find(loc => loc.id === mystery.startingLocationId)?.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No starting location selected.</p>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md">
                    <p className="text-sm font-medium">Difficulty</p>
                    <p className="text-lg">{mystery.difficulty.charAt(0).toUpperCase() + mystery.difficulty.slice(1)}</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-sm font-medium">Estimated Time</p>
                    <p className="text-lg">{mystery.estimatedTime} minutes</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-sm font-medium">Locations</p>
                    <p className="text-lg">{mystery.locations.length}</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-sm font-medium">Characters</p>
                    <p className="text-lg">{mystery.characters.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>This is just a basic preview. In the actual game, players will navigate between locations, interact with characters, collect items, and discover clues to solve the mystery.</p>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsPreviewMode(false)}>Close Preview</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}