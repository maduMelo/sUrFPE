# Análise de Atletas sUrFPE

**sUrFPE Athlete Analysis** é uma aplicação web desenvolvida para apoiar instrutores e monitores da organização **sUrFPE**. O sistema gera relatórios com base em arquivos CSV gerados a partir da interface do **Dartfish** contendo as notas de avaliações de treinamentos práticos de surf, fornecendo uma visão analítica sobre o desempenho dos estudantes.

---

## 📊 O Que a Aplicação Faz

- Recebe um arquivo `.csv` com dados estruturados de avaliação de treinos
- Realiza análise estatística das notas com base em:
  - `Manobras`
  - `Base do Surfista`
  - `Lado da Onda`
  - `Indicadores de Manobra`
- Retorna uma visão detalhada do desempenho do atleta através de gráficos e feedback por AI, possibilidando seu download em PDF.

---

## 📂 Formato do Arquivo CSV

O sistema espera um arquivo `.csv` com as seguintes colunas:

```
['Lado Onda', 'Atleta', 'Classificação', 'Indicador Manobra', 'Manobras', 'Base do Surfista']
```

> ❗ Arquivos fora desse formato farão com que a API retorne um erro.

---

## 👀 Demonstração

É possível testar a aplicação através dos links abaixo e usando esse **[📁 exemplo de CSV](test-data/data.csv)**


🔗 **[Frontend da aplicação](https://beautiful-mousse-fe0ad4.netlify.app/)** 

🔗 **[Interface para testar API](https://elegant-naiad-6a2f2d.netlify.app/)** 

🔗 **[URL da API](https://meom.pythonanywhere.com/)** 

🔗 **[Análises realizadas no Google Colab](https://colab.research.google.com/drive/11RRetspBUfZcAM0Vt_AFy-9a-7IeHD8B?usp=sharing)**  

---

## 🛠️ Tecnologias Utilizadas

### Backend (Python + Flask)
- `pandas` e `numpy` para análise de dados
- API do `gemini` para geração do feedback
- `Flask` para a API
- Hospedado no **PythonAnywhere**

### Frontend (React + TypeScript)
- React + Vite + TypeScript
- `axios` para requisições à API
- `ApexCharts` para exibição de gráficos
- Hospedado no **Netlify**

---

## 📎 Melhorias Futuras

- Melhorar UI/UX da interface
- Melhorar responsividade do site
- Adicionar gráficos para evolução do atleta ao longo do treino
- Adicionar mais informações demográficas (informações sobre atleta, avaliador, treino) ao baixar feedback

---
