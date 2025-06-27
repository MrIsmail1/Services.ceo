import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixServiceConfigs() {
  console.log('🔧 Vérification et correction des configurations de services...');

  // Récupérer tous les services sans configuration
  const servicesWithoutConfig = await prisma.service.findMany({
    where: {
      configId: null
    },
    include: {
      config: true
    }
  });

  console.log(`📊 ${servicesWithoutConfig.length} services sans configuration trouvés`);

  for (const service of servicesWithoutConfig) {
    console.log(`\n🔧 Traitement du service: ${service.name} (${service.id})`);

    // Créer une configuration par défaut
    const defaultSystemPrompt = `Tu es un assistant IA spécialisé dans ${service.description || 'le traitement de données'}. Tu dois fournir des réponses utiles et précises.`;
    const defaultUserPrompt = `Traite les données suivantes et fournis un résultat utile:\n\n{input}`;

    const config = await prisma.serviceConfig.create({
      data: {
        inputSchema: { type: 'object', properties: {} },
        outputSchema: { type: 'object', properties: {} },
        constraints: {},
        requirements: [],
        systemPrompt: defaultSystemPrompt,
        userPrompt: defaultUserPrompt,
        uiConfig: {},
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: service.createdById
        }
      }
    });

    // Associer la configuration au service
    await prisma.service.update({
      where: { id: service.id },
      data: { configId: config.id }
    });

    console.log(`✅ Configuration créée et associée au service ${service.name}`);
  }

  // Vérifier les configurations existantes
  const servicesWithConfig = await prisma.service.findMany({
    where: {
      configId: { not: null }
    },
    include: {
      config: true
    }
  });

  console.log(`\n📊 ${servicesWithConfig.length} services avec configuration:`);
  
  for (const service of servicesWithConfig) {
    const config = service.config;
    console.log(`\n📋 Service: ${service.name}`);
    console.log(`   - System Prompt: ${config?.systemPrompt ? '✅' : '❌'} ${config?.systemPrompt?.substring(0, 50)}...`);
    console.log(`   - User Prompt: ${config?.userPrompt ? '✅' : '❌'} ${config?.userPrompt?.substring(0, 50)}...`);
    
    // Si les prompts sont vides, les mettre à jour
    if (!config?.systemPrompt || !config?.userPrompt) {
      const defaultSystemPrompt = config?.systemPrompt || `Tu es un assistant IA spécialisé dans ${service.description || 'le traitement de données'}. Tu dois fournir des réponses utiles et précises.`;
      const defaultUserPrompt = config?.userPrompt || `Traite les données suivantes et fournis un résultat utile:\n\n{input}`;

      await prisma.serviceConfig.update({
        where: { id: config!.id },
        data: {
          systemPrompt: defaultSystemPrompt,
          userPrompt: defaultUserPrompt
        }
      });

      console.log(`   🔧 Prompts mis à jour`);
    }
  }

  console.log('\n✅ Script terminé !');
}

fixServiceConfigs()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 