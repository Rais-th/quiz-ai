import type { LearningModule } from "@/components/learning-mode";

const aiSecurityModule: LearningModule = {
  id: 'ai-security',
  title: 'AI Security Fundamentals',
  description: 'Hands-on practice with AI security concepts',
  icon: '🤖',
  difficulty: 'Intermediate',
  estimatedTime: '60 min',
  content: {
    introduction: 
      'Learn AI security through hands-on exercises and real-world scenarios. ' +
      'You will practice identifying vulnerabilities, implementing protections, and responding to attacks.',
    keyPoints: [
      'Practical experience with AI attack vectors',
      'Hands-on model security implementation',
      'Real-world incident response scenarios',
      'Interactive security testing exercises',
      'Live system hardening practice'
    ],
    examples: [
      {
        scenario: 'Lab 1: Detecting and Preventing Model Theft',
        explanation: 
          'In this hands-on lab, you will:\n' +
          '1. Set up a vulnerable AI model service\n' +
          '2. Attempt model extraction attacks\n' +
          '3. Implement model watermarking\n' +
          '4. Test protection effectiveness\n' +
          '5. Monitor for extraction attempts\n\n' +
          'Tools needed: Python, TensorFlow/PyTorch, Jupyter Notebook\n' +
          'Estimated time: 20 minutes'
      },
      {
        scenario: 'Lab 2: Defending Against Adversarial Attacks',
        explanation: 
          'Interactive exercise where you will:\n' +
          '1. Create adversarial examples\n' +
          '2. Test model vulnerabilities\n' +
          '3. Implement defensive techniques\n' +
          '4. Validate defenses\n' +
          '5. Monitor model robustness\n\n' +
          'Tools needed: Python, AI Security Toolkit\n' +
          'Estimated time: 25 minutes'
      }
    ],
    practiceQuestions: [
      {
        question: 'Your AI model suddenly shows degraded performance. Using the provided monitoring dashboard, identify the most likely attack.',
        options: [
          'Data poisoning attack (unusual training patterns detected)',
          'Model extraction (high volume of similar queries)',
          'Resource exhaustion (normal load patterns)',
          'Random performance fluctuation (no attack patterns)'
        ],
        answer: 'Data poisoning attack (unusual training patterns detected)',
        explanation: 'The monitoring dashboard shows suspicious patterns in training data updates, indicating a potential poisoning attack. In real scenarios, monitoring these patterns is crucial for early attack detection.'
      }
    ]
  }
};

const aiPrivacyLabModule: LearningModule = {
  id: 'ai-privacy-lab',
  title: 'AI Privacy Protection Lab',
  description: 'Hands-on privacy implementation exercises',
  icon: '🔏',
  difficulty: 'Advanced',
  estimatedTime: '90 min',
  content: {
    introduction: 
      'Practice implementing privacy-preserving AI techniques in a controlled lab environment. ' +
      'Work with real systems and data to understand privacy challenges and solutions.',
    keyPoints: [
      'Practical privacy implementation',
      'Real data protection exercises',
      'Interactive compliance checking',
      'Privacy attack simulations',
      'Protection validation testing'
    ],
    examples: [
      {
        scenario: 'Lab 1: Implementing Federated Learning',
        explanation: 
          'Hands-on implementation exercise:\n' +
          '1. Set up a distributed learning environment\n' +
          '2. Implement federated averaging\n' +
          '3. Test privacy guarantees\n' +
          '4. Monitor data protection\n' +
          '5. Validate learning effectiveness\n\n' +
          'Tools needed: Python, FederatedML Framework\n' +
          'Estimated time: 40 minutes'
      },
      {
        scenario: 'Lab 2: Privacy Attack Simulation',
        explanation: 
          'Interactive privacy testing:\n' +
          '1. Attempt membership inference attacks\n' +
          '2. Implement differential privacy\n' +
          '3. Measure privacy-utility tradeoff\n' +
          '4. Test protection effectiveness\n' +
          '5. Document privacy guarantees\n\n' +
          'Tools needed: Privacy Testing Suite\n' +
          'Estimated time: 35 minutes'
      }
    ],
    practiceQuestions: [
      {
        question: 'Using the provided privacy testing framework, which protection method best preserves model accuracy?',
        options: [
          'Implement ε=1.0 differential privacy with adaptive clipping',
          'Apply basic data anonymization',
          'Use simple random noise addition',
          'Implement strict access controls only'
        ],
        answer: 'Implement ε=1.0 differential privacy with adaptive clipping',
        explanation: 'Through hands-on testing, you can verify that adaptive clipping with DP provides the best balance of privacy and utility. The framework allows direct comparison of different methods.'
      }
    ]
  }
};

const aiSecurityTestingModule: LearningModule = {
  id: 'ai-security-testing',
  title: 'AI Security Testing Workshop',
  description: 'Practice security testing on real AI systems',
  icon: '🔬',
  difficulty: 'Advanced',
  estimatedTime: '120 min',
  content: {
    introduction: 
      'Get hands-on experience testing AI system security through guided workshops. ' +
      'Practice with real tools and systems in a safe environment.',
    keyPoints: [
      'Practical security testing',
      'Real vulnerability assessment',
      'Attack simulation practice',
      'Defense validation',
      'Security monitoring setup'
    ],
    examples: [
      {
        scenario: 'Workshop 1: Complete Security Assessment',
        explanation: 
          'Guided security testing workshop:\n' +
          '1. Set up testing environment\n' +
          '2. Run automated security scans\n' +
          '3. Perform manual testing\n' +
          '4. Document vulnerabilities\n' +
          '5. Implement fixes\n\n' +
          'Tools needed: Security Testing Suite, Documentation Template\n' +
          'Estimated time: 60 minutes'
      },
      {
        scenario: 'Workshop 2: Incident Response',
        explanation: 
          'Interactive incident response exercise:\n' +
          '1. Detect security incidents\n' +
          '2. Analyze attack patterns\n' +
          '3. Implement countermeasures\n' +
          '4. Document response steps\n' +
          '5. Review and improve\n\n' +
          'Tools needed: Incident Response Toolkit\n' +
          'Estimated time: 45 minutes'
      }
    ],
    practiceQuestions: [
      {
        question: 'During the security assessment, you discover unusual model behavior. Using the provided tools, what should you investigate first?',
        options: [
          'Analyze recent model queries and responses',
          'Check system resource usage',
          'Review access logs',
          'Scan for malware'
        ],
        answer: 'Analyze recent model queries and responses',
        explanation: 'The hands-on exercise demonstrates that analyzing model behavior patterns is the most effective first step in identifying potential security breaches.'
      }
    ]
  }
};

export const learningModules = [
  aiSecurityModule,
  aiPrivacyLabModule,
  aiSecurityTestingModule
]; 