import { Annotation } from "@gliff-ai/annotate";
import { ImageFileInfo } from "@gliff-ai/upload";

type CustomMetadata = { [key: string]: string | number | string[] | boolean };

interface Metadata extends CustomMetadata {
  id: string;
  imageLabels: string[];
}

interface AnnotateInput {
  imageData: ImageBitmap[][];
  imageFileInfo: ImageFileInfo;
  annotationData: Annotation[];
}

interface CurateInput {
  metadata: Metadata[]; // metadata for all the selected images
}

type PluginInput = CurateInput | AnnotateInput;

type AnnotateOutput = Partial<{
  annotationData: Annotation[]; // any new annotation and label
  metadata: Metadata; // metadata for the selected image
}>;

type CurateOutput = Partial<{
  metadata: Metadata[]; // metadata that requires updating
}>;

interface PluginOutput {
  message?: string; // any message returned by the plugin; this is displayed as a warning or error message.
  domElement?: JSX.Element | null; // some output that takes the form of a DOM element to be displayed in the UI.
  data?: AnnotateOutput | CurateOutput; // data to be saved
}

type Toolbox = "spline" | "paintbrush" | "boundingBox"; // TODO: import this from ANNOTATE

export {
  PluginInput,
  PluginOutput,
  AnnotateInput,
  CurateInput,
  Toolbox,
  CustomMetadata,
  Metadata,
};
