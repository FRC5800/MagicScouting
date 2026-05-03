
/** @type {import('./$types').PageServerLoad} */

import {GoogleGenerativeAI} from "@google/generative-ai";
import { env } from '$env/dynamic/private';

const GEMINI_API_KEY = env.GEMINI_API_KEY;

export async function load() {
    
    const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
	const model = ai.getGenerativeModel({model: "gemini-3-flash-preview"});


	//FALTA ADICIONAR UMA FORMA DE OBTER OS DADOS DA PLANILHA REFERENTES À EQUIPE DE ANÁLISE ATUAL
		try{
			// const prompt = `Os seguintes dados são observações de scouters de uma competição FRC sobre um robô: ${JSON.stringify(dadosPlanilha)} crie um resumo dos dados do robô com ao menos 3 dos seguintes pontos: Forças, Fraquezas, Inconsistências, Habilidade do Human Player`;
			const prompt = `Tell me FRC facts under 4 lines of text`;

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const textoResumido = response.text();
			
			console.log("RESPOSTA DA IA AQUI: ", textoResumido);
            
			return{
				textoIA : textoResumido
			}
			
		}
		catch (e){

		console.error("Erro ao chamar IA: ", e);

		return{
			textoIA : "Erro ao gerar resposta do agente"
		}

		}
		
};