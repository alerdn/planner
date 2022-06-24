import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Project from "App/Models/Project";
import User from "App/Models/User";

export default class ProjectsController {
	public async addProject({ request, auth }: HttpContextContract) {
		const { nome } = request.all();
		const user = auth.user!;

		return await Project.create({ nome, userId: user.id });
	}

	public async projects({ auth }: HttpContextContract) {
		const user = auth.user!;
		await user.load("projects");

		const projectMember = (
			await Database.rawQuery(
				`
                SELECT p.*, false as owner
                FROM projects p, projects_members pm
                where p.id = pm.project_id 
                    AND pm.user_id = ?
                `,
				[user.id]
			)
		).rows;

		const projects = projectMember.concat(
			user.projects.map((p) => {
				const pr = p.toJSON();
				pr["owner"] = true;
				return pr;
			})
		);

		return projects;
	}

	public async addMember({ request, response, auth }: HttpContextContract) {
		const { email, projectId } = request.all();
		const user = auth.user!;

		const project = await Project.findOrFail(projectId);
		const member = await User.findByOrFail("email", email);

		if (project.userId != user.id)
			return response.badRequest({
				success: false,
				message: "Você não tem autorização para adicionar um membro neste projeto",
			});

		return await Database.table("projects_members").insert({
			user_id: member.id,
			project_id: projectId,
		});
	}

	public async removeMember({ request, response, auth }: HttpContextContract) {
		const { email, projectId } = request.all();
		const user = auth.user!;

		const project = await Project.findOrFail(projectId);
		const member = await User.findByOrFail("email", email);

		if (project.userId != user.id)
			return response.badRequest({
				success: false,
				message: "Você não tem autorização para remover um membro deste projeto",
			});

		return await Database.query()
			.from("projects_members")
			.where({
				user_id: member.id,
				project_id: projectId,
			})
			.delete();
	}

	public async members({ request }: HttpContextContract) {
		const { projectId } = request.all();

		const otherMembers = (
			await Database.rawQuery(
				`
            SELECT DISTINCT u.*
            FROM users u, projects_members pm, projects p
            WHERE (u.id = pm.user_id and pm.project_id = p.id and pm.project_id = ?)
        `,
				[projectId]
			)
		).rows;

		const project = await Project.findOrFail(projectId);
		await project.load("user");
		const owner = project.user;

		const members = otherMembers.concat(owner);
		return members;
	}
}
