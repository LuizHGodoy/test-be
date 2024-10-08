import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/services/prisma/prisma.service";
import { CreateAditionalServiceDto } from "./dto/create-aditional-service.dto";
import { UpdateAditionalServiceDto } from "./dto/update-aditional-service.dto";
import { ServicoEntity } from "./entities/aditional-service.entity";

@Injectable()
export class AditionalServicesService {
	constructor(private prisma: PrismaService) {}

	async create(createAditionalServiceDto: CreateAditionalServiceDto) {
		const service = await this.prisma.servico
			.create({
				data: createAditionalServiceDto,
			})
			.catch((error) => {
				if (error.code === "P2002") {
					throw new BadRequestException("Já existe um serviço com este nome");
				}
				throw error;
			});

		return {
			status: 201,
			message: "Serviço adicional criado com sucesso",
			data: service,
		};
	}

	async findAll(page = 1, limit = 10) {
		if (page < 1) {
			throw new BadRequestException("A página deve ser maior ou igual a 1");
		}

		if (limit < 1) {
			throw new BadRequestException("O limite deve ser maior ou igual a 1");
		}

		const skip = (page - 1) * limit;

		const services = await this.prisma.servico.findMany({
			skip,
			take: limit,
		});

		return services.map((service) => new ServicoEntity(service));
	}

	async findOne(uuid: string) {
		const service = await this.prisma.servico.findUnique({
			where: { uuid },
		});

		if (!service) {
			throw new NotFoundException("Serviço adicional não encontrado");
		}

		return {
			status: 200,
			message: "Serviço adicional encontrado com sucesso",
			data: service,
		};
	}

	async update(
		uuid: string,
		updateAditionalServiceDto: UpdateAditionalServiceDto,
	) {
		const service = await this.prisma.servico
			.update({
				where: { uuid },
				data: updateAditionalServiceDto,
			})
			.catch((error) => {
				if (error.code === "P2025") {
					throw new NotFoundException("Serviço adicional não encontrado");
				}
				throw error;
			});

		return {
			status: 200,
			message: "Serviço adicional atualizado com sucesso",
			data: service,
		};
	}

	async remove(uuid: string) {
		await this.prisma.servico
			.delete({
				where: { uuid },
			})
			.catch((error) => {
				if (error.code === "P2025") {
					throw new NotFoundException("Serviço adicional não encontrado");
				}
				throw error;
			});

		return {
			status: 200,
			message: "Serviço adicional removido com sucesso",
		};
	}
}
