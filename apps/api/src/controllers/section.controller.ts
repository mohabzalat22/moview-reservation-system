import type { CreateSection, UpdateSection } from "../dto/section.dto";
import { SectionService } from "../services/section.service";
import { ApiResponse } from "../utils/api-response";
import type { Request, Response } from "express";

export class SectionController {
  private sectionService;
  private apiResponse;

  constructor() {
    this.apiResponse = new ApiResponse();
    this.sectionService = new SectionService();
  }

  async index(req: Request, res: Response) {
    const { hallId } = req.query;
    if (hallId) {
      const sections = await this.sectionService.getSectionsByHallId(hallId as string);
      return this.apiResponse.success(res, sections);
    }
    const sections = await this.sectionService.getSections();
    return this.apiResponse.success(res, sections);
  }

  async show(req: Request, res: Response) {
    const id = req.params.id as string;
    const section = await this.sectionService.getSectionById(id);
    return this.apiResponse.success(res, section);
  }

  async store(req: Request, res: Response) {
    const data = req.body as CreateSection;
    const section = await this.sectionService.createSection(data);
    return this.apiResponse.success(res, section);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body as UpdateSection;
    const section = await this.sectionService.updateSection(id, data);
    return this.apiResponse.success(res, section);
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const section = await this.sectionService.deleteSectionById(id);
    return this.apiResponse.success(res, section);
  }
}
