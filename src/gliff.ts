import {
  Annotation,
  Spline,
  BoundingBox,
  BrushStroke,
} from "@gliff-ai/annotate";
import { XYPoint } from "@gliff-ai/annotate/dist/src/annotation/interfaces";
import { CustomMetadata, PluginInput, Metadata } from "./interfaces";

type SpaceTimeInfo = BrushStroke["spaceTimeInfo"];
type Brush = BrushStroke["brush"];
type BrushType = "paint" | "eraser";

/**
 * Gliff SDK
 * @class
 */
export default class Gliff {
  public brush: Brush;

  constructor() {
    this.brush = {
      radius: 0.5,
      type: "paint",
      color: "#FF0000FF",
      is3D: false,
    };
  }

  /**
   * Set the brush object used for making brush-strokes annotations.
   *
   * @param brush - the new brush object.
   * @param type - the type of brush, either "paint" or "eraser" (defaults to "paint").
   * @param is3D - whether to use a 3D brush or not (defaults to false).
   */
  setBrush(radius = 0.5, type: BrushType = "paint", is3D = false): void {
    this.brush = { ...this.brush, radius, type, is3D };
  }

  /**
   * Get the brush object used for making brush-strokes annotations.
   *
   * @return the brush object.
   */
  get getBrush(): Brush {
    return this.brush;
  }

  /**
   * Check whether the plugin received the expected data as input.
   *
   * @param data - data passed as input to the onClick method.
   * @param product - the product the plugin is added to.
   * @return the data, if this is as expected, null, otherwise.
   */
  public static checkInputData(
    data: PluginInput,
    product: "ANNOTATE" | "CURATE"
  ): PluginInput | null {
    if (product === "ANNOTATE" && "imageData" in data) {
      return data;
    }

    if (product === "CURATE" && "metadata" in data) {
      return data;
    }

    alert(`This plugin only works in ${product}.`);
    return null;
  }

  /**
   * Create a bounding-box object.
   *
   * @param topLeft - the (x,y) coordinates for the top-left box corner.
   * @param bottomRight - the (x,y) coordinates for the bottom-right box corner.
   * @param spaceTimeInfo - the z- (slice number) and t- (time point) coordinates (defaults to first slice and time point).
   * @return the new bouding-box object.
   */
  public static createBoundingBox(
    topLeft: XYPoint,
    bottomRight: XYPoint,
    spaceTimeInfo: SpaceTimeInfo = { z: 0, t: 0 }
  ): BoundingBox {
    return {
      coordinates: {
        topLeft,
        bottomRight,
      },
      spaceTimeInfo,
    };
  }

  /**
   * Create a spline object.
   *
   * @param coordinates - a list of (x,y) coordinates that define the spline points.
   * @param spaceTimeInfo - the z- (slice number) and t- (time point) coordinates (defaults to first slice and time point).
   * @param isClosed - whether the spline is closed or open (defaults to false).
   * @return the new spline object.
   */
  public static createSpline(
    coordinates: XYPoint[],
    spaceTimeInfo: SpaceTimeInfo = { z: 0, t: 0 },
    isClosed = false
  ): Spline {
    return {
      coordinates,
      spaceTimeInfo,
      isClosed,
    };
  }

  /**
   * Create a brush-stroke object.
   *
   * @param coordinates - a list of (x,y) coordinates that define the brush connected strokes.
   * @param spaceTimeInfo - the z- (slice number) and t- (time point) coordinates (defaults to first slice and time point).
   * @return the new brush-stroke object.
   */
  public createBrushStroke(
    coordinates: XYPoint[],
    spaceTimeInfo: SpaceTimeInfo = { z: 0, t: 0 }
  ): BrushStroke {
    return {
      coordinates,
      spaceTimeInfo,
      brush: this.brush,
    };
  }

  /**
   * Create an annotation object.
   *
   * Toolbox, the only required parameter, defines the annotation's type, which corresponds to the toolbox used for creating it.
   * Depending on the value passed for toolbox, a non-empty annotation should have either the spline, the bounding_box
   * or the brush_strokes parameter set.
   *
   *
   * @param toolbox - the toolbox used for making the annotation.
   * @param labels - a list of labels applied to the annotation.
   * @param spline - a spline object (default to an empty spline)
   * @param BoundingBox - a bounding-box object (defaults to an empty bounding-box)
   * @param brushStrokes - a brush-stroke object (defaults to an empty brush-stroke)
   * @param parameters - an object containing any parameter relevant to the annotation (defaults to an empty object)
   * @return the new annotation object.
   */
  public static createAnnotation(
    toolbox: string,
    labels: string[] = [],
    spline: Spline = {
      coordinates: [],
      spaceTimeInfo: { z: 0, t: 0 },
      isClosed: false,
    },
    boundingBox: BoundingBox = {
      coordinates: {
        topLeft: { x: null, y: null },
        bottomRight: { x: null, y: null },
      },
      spaceTimeInfo: { z: 0, t: 0 },
    },
    brushStrokes: BrushStroke[] = [],
    parameters: Annotation["parameters"] = {}
  ): Annotation {
    return { toolbox, labels, spline, boundingBox, brushStrokes, parameters };
  }

  /**
   * Check whether an annotation is empty.*
   *
   * @param annotation - an annotation object.
   * @return wether the annotation passed as input is empty or not.
   */
  public static isEmptyAnnotation(annotation: Annotation): boolean {
    return (
      annotation.spline.coordinates.length === 0 &&
      annotation.brushStrokes.length === 0 &&
      annotation.boundingBox.coordinates.topLeft.x === null
    );
  }

  /**
   * Create a metadata object for a single image.
   *
   * @param id - the image ID for which the metadata is created.
   * @param customImageMetadata - any key-value pair to add to the image file info.
   * @param imageLabels - a list of image-wise labels.
   * @return the new metadata object.
   */
  public static createImageMetadata(
    id: string,
    customImageMetadata?: CustomMetadata,
    imageLabels?: string[]
  ): Metadata {
    return { id, ...customImageMetadata, imageLabels };
  }
}
