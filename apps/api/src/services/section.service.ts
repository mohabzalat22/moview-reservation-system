import type { CreateSection, UpdateSection } from "../dto/section.dto";
import { SectionRepository } from "../repositories/section.repository";

export class SectionService {
  private sectionRepository;

  constructor() {
    this.sectionRepository = new SectionRepository();
  }

  async getSections() {
    return this.sectionRepository.findAll();
  }

  async getSectionsByHallId(hallId: string) {
    return this.sectionRepository.findAllByHallId(hallId);
  }

  async getSectionById(id: string) {
    return this.sectionRepository.findById(id);
  }

  async createSection(data: CreateSection) {
    return this.sectionRepository.create(data);
  }

  async updateSection(id: string, data: UpdateSection) {
    const sectionExists = await this.sectionRepository.findById(id);
    if (!sectionExists) {
      throw new Error("Section does not exist");
    }
    return this.sectionRepository.update(id, data);
  }

  async deleteSectionById(id: string) {
    const sectionExists = await this.sectionRepository.findById(id);
    if (!sectionExists) {
      throw new Error("Section does not exist");
    }
    return this.sectionRepository.deleteById(id);
  }
}
