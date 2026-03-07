from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

def run_analysis_agent(text):
    prompt = PromptTemplate(
        input_variables=["text"],
        template="Analyze the prescription and list medicines and warnings: {text}"
    )

    chain = prompt | llm
    result = chain.invoke({"text": text})
    return str(result)
