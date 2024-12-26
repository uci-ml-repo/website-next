import type { Dataset } from "@prisma/client";

export function getPythonSnippet({ id, slug }: Dataset) {
  let variableName = slug.replace(/[^a-zA-Z0-9]/g, "_");

  return `from ucimlrepo import fetch_ucirepo 
  
# fetch dataset 
${variableName} = fetch_ucirepo(id=${id}) 
  
# data (as pandas dataframes) 
x = ${variableName}.data.features 
y = ${variableName}.data.targets 
  
# metadata 
print(${variableName}.metadata) 
  
# variable information 
print(${variableName}.variables) `;
}
