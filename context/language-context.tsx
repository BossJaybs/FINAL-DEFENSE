"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the available languages
export type Language = "en" | "es" | "fr" | "de" | "ja"

// Define the date format options
export type DateFormat = "mdy" | "dmy" | "ymd"

// Define the structure for our translations
export interface Translations {
  // Common UI elements
  common: {
    back: string
    save: string
    cancel: string
    delete: string
    edit: string
    loading: string
    search: string
    noResults: string
    welcome: string
  }

  // Navigation
  nav: {
    dashboard: string
    progress: string
    goals: string
    activity: string
    profile: string
    settings: string
    logout: string
  }

  // Dashboard
  dashboard: {
    welcomeBack: string
    keepUp: string
    currentStreak: string
    weeklyLearning: string
    goalCompletion: string
    days: string
    hours: string
    learningGoals: string
    addGoal: string
    noGoals: string
    createFirstGoal: string
    viewAll: string
    learningProgress: string
    dailyActivity: string
    weeklyTrends: string
    timeByType: string
  }

  // Progress
  progress: {
    title: string
    subtitle: string
    view: string
    week: string
    month: string
    year: string
    allTime: string
    totalHours: string
    topicsCovered: string
    currentStreak: string
    avgDailyTime: string
    best: string
    from: string
    learningActivity: string
    hoursPerDay: string
  }

  // Goals
  goals: {
    title: string
    subtitle: string
    addNewGoal: string
    activeGoals: string
    completed: string
    allGoals: string
    noGoalsFound: string
    addYourFirstGoal: string
    createNewGoal: string
    defineGoal: string
    goalTitle: string
    description: string
    deadline: string
    priority: string
    high: string
    medium: string
    low: string
    milestones: string
    addMilestone: string
    createGoal: string
    updateGoal: string
    markComplete: string
    deleteGoal: string
    confirmDelete: string
    goalDeleted: string
    selectAll: string
    deleteSelected: string
    confirmDeleteMultiple: string
    goalsDeleted: string
    onTrack: string
    atRisk: string
    inProgress: string
    progress: string
    status: string
    actions: string
  }

  // Activity
  activity: {
    title: string
    recentActivities: string
    dragToReorder: string
    noActivities: string
    addActivity: string
    duration: string
    date: string
    priority: string
  }

  // Profile
  profile: {
    title: string
    personalInfo: string
    updateProfile: string
    profilePicture: string
    changeProfilePic: string
    recommendedImage: string
    firstName: string
    lastName: string
    email: string
    bio: string
    saveChanges: string
    profileUpdated: string
  }

  // Settings (already implemented, but included for completeness)
  settings: {
    title: string
    subtitle: string

    // Navigation
    appearanceNav: string
    notificationsNav: string
    languageNav: string
    securityNav: string
    helpNav: string

    // Appearance
    appearanceTitle: string
    darkModeLabel: string
    darkModeDesc: string
    fontSizeLabel: string
    fontSizeSmall: string
    fontSizeMedium: string
    fontSizeLarge: string
    saveAppearance: string

    // Notifications
    notificationsTitle: string
    emailNotifLabel: string
    emailNotifDesc: string
    pushNotifLabel: string
    pushNotifDesc: string
    weeklyLabel: string
    weeklyDesc: string

    // Language & Region
    languageTitle: string
    languageLabel: string
    dateFormatLabel: string
    saveLanguage: string

    // Security
    securityTitle: string
    changePasswordTitle: string
    currentPasswordLabel: string
    newPasswordLabel: string
    confirmPasswordLabel: string
    updatePasswordButton: string
    twoFactorTitle: string
    twoFactorDesc: string
    enable2FAButton: string
    passwordsDoNotMatch: string
    passwordTooShort: string
    passwordUpdatedTitle: string
    passwordUpdatedDesc: string
    errorTitle: string
    passwordUpdateError: string

    // Help & Support
    helpTitle: string
    faqTitle: string
    faqQuestion1: string
    faqAnswer1: string
    faqQuestion2: string
    faqAnswer2: string
    contactTitle: string
    contactDesc: string
    subjectLabel: string
    subjectPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    sendMessageButton: string
    messageSentTitle: string
    messageSentDesc: string
  }
}

// Define the context type
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  dateFormat: DateFormat
  setDateFormat: (format: DateFormat) => void
  t: Translations
  formatDate: (date: string | Date) => string
  saveLanguageSettings: () => void
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Define translations for each language
const translations: Record<Language, Translations> = {
  en: {
    common: {
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      loading: "Loading...",
      search: "Search",
      noResults: "No results found",
      welcome: "Welcome",
    },
    nav: {
      dashboard: "Dashboard",
      progress: "Progress",
      goals: "Goals",
      activity: "Activity",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
    },
    dashboard: {
      welcomeBack: "Welcome back",
      keepUp: "You're on a roll! Keep up the great learning momentum.",
      currentStreak: "Current Streak",
      weeklyLearning: "Weekly Learning",
      goalCompletion: "Goal Completion",
      days: "days",
      hours: "hours",
      learningGoals: "Learning Goals",
      addGoal: "Add Goal",
      noGoals: "No goals added yet",
      createFirstGoal: "Create your first goal",
      viewAll: "View all",
      learningProgress: "Learning Progress Charts",
      dailyActivity: "Daily Activity",
      weeklyTrends: "Weekly Trends",
      timeByType: "Time by Type",
    },
    progress: {
      title: "Learning Progress",
      subtitle: "Track your learning journey and see how far you've come",
      view: "View",
      week: "Week",
      month: "Month",
      year: "Year",
      allTime: "All Time",
      totalHours: "Total Hours",
      topicsCovered: "Topics Covered",
      currentStreak: "Current Streak",
      avgDailyTime: "Avg. Daily Time",
      best: "Best",
      from: "from last",
      learningActivity: "Learning Activity",
      hoursPerDay: "Hours spent learning per day",
    },
    goals: {
      title: "Learning Goals",
      subtitle: "Set, track, and achieve your learning objectives",
      addNewGoal: "Add New Goal",
      activeGoals: "Active Goals",
      completed: "Completed",
      allGoals: "All Goals",
      noGoalsFound: "No goals found",
      addYourFirstGoal: "Add your first goal",
      createNewGoal: "Create New Learning Goal",
      defineGoal: "Define your learning objective, set a deadline, and track your progress.",
      goalTitle: "Goal Title",
      description: "Description",
      deadline: "Deadline",
      priority: "Priority",
      high: "High",
      medium: "Medium",
      low: "Low",
      milestones: "Milestones",
      addMilestone: "Add Milestone",
      createGoal: "Create Goal",
      updateGoal: "Update Goal",
      markComplete: "Mark as Complete",
      deleteGoal: "Delete Goal",
      confirmDelete: "Are you sure you want to delete this goal? This action cannot be undone.",
      goalDeleted: "Your learning goal has been deleted.",
      selectAll: "Select All",
      deleteSelected: "Delete Selected",
      confirmDeleteMultiple: "Are you sure you want to delete the selected goals? This action cannot be undone.",
      goalsDeleted: "Successfully deleted goals.",
      onTrack: "On Track",
      atRisk: "At Risk",
      inProgress: "In Progress",
      progress: "Progress",
      status: "Status",
      actions: "Actions",
    },
    activity: {
      title: "Activity History",
      recentActivities: "Recent Learning Activities",
      dragToReorder: "Drag items to reorder by priority",
      noActivities: "No activities yet. Create a new goal to see activities here.",
      addActivity: "Add Activity",
      duration: "Duration",
      date: "Date",
      priority: "Priority",
    },
    profile: {
      title: "Profile Settings",
      personalInfo: "Personal Information",
      updateProfile: "Update your profile information and how others see you on the platform",
      profilePicture: "Profile Picture",
      changeProfilePic: "Change Profile Picture",
      recommendedImage: "Recommended: Square image, at least 400x400px",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      bio: "Bio",
      saveChanges: "Save Changes",
      profileUpdated: "Your profile has been updated successfully.",
    },
    settings: {
      title: "Settings",
      subtitle: "Manage your account settings and preferences",

      // Navigation
      appearanceNav: "Appearance",
      notificationsNav: "Notifications",
      languageNav: "Language & Region",
      securityNav: "Security",
      helpNav: "Help & Support",

      // Appearance
      appearanceTitle: "Appearance Settings",
      darkModeLabel: "Dark Mode",
      darkModeDesc: "Switch between light and dark theme",
      fontSizeLabel: "Font Size",
      fontSizeSmall: "Small",
      fontSizeMedium: "Medium",
      fontSizeLarge: "Large",
      saveAppearance: "Save Appearance Settings",

      // Notifications
      notificationsTitle: "Notification Settings",
      emailNotifLabel: "Email Notifications",
      emailNotifDesc: "Receive updates about your progress via email",
      pushNotifLabel: "Push Notifications",
      pushNotifDesc: "Receive notifications on your device",
      weeklyLabel: "Weekly Summary",
      weeklyDesc: "Get a weekly report of your learning progress",

      // Language & Region
      languageTitle: "Language & Region Settings",
      languageLabel: "Language",
      dateFormatLabel: "Date Format",
      saveLanguage: "Save Language Settings",

      // Security
      securityTitle: "Security Settings",
      changePasswordTitle: "Change Password",
      currentPasswordLabel: "Current Password",
      newPasswordLabel: "New Password",
      confirmPasswordLabel: "Confirm New Password",
      updatePasswordButton: "Update Password",
      twoFactorTitle: "Two-Factor Authentication",
      twoFactorDesc: "Add an extra layer of security to your account",
      enable2FAButton: "Enable 2FA",
      passwordsDoNotMatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 8 characters",
      passwordUpdatedTitle: "Password Updated",
      passwordUpdatedDesc: "Your password has been successfully updated.",
      errorTitle: "Error",
      passwordUpdateError: "Failed to update password. Please try again.",

      // Help & Support
      helpTitle: "Help & Support",
      faqTitle: "Frequently Asked Questions",
      faqQuestion1: "How do I track my learning progress?",
      faqAnswer1: "You can track your learning progress in several ways",
      faqQuestion2: "How do I set learning goals?",
      faqAnswer2: "To set learning goals",
      contactTitle: "Contact Support",
      contactDesc: "Need help? Our support team is here for you",
      subjectLabel: "Subject",
      subjectPlaceholder: "What do you need help with?",
      messageLabel: "Message",
      messagePlaceholder: "Describe your issue in detail",
      sendMessageButton: "Send Message",
      messageSentTitle: "Message sent",
      messageSentDesc: "We'll get back to you as soon as possible",
    },
  },
  es: {
    common: {
      back: "Atrás",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      loading: "Cargando...",
      search: "Buscar",
      noResults: "No se encontraron resultados",
      welcome: "Bienvenido",
    },
    nav: {
      dashboard: "Panel",
      progress: "Progreso",
      goals: "Objetivos",
      activity: "Actividad",
      profile: "Perfil",
      settings: "Configuración",
      logout: "Cerrar sesión",
    },
    dashboard: {
      welcomeBack: "Bienvenido de nuevo",
      keepUp: "¡Estás en racha! Mantén el gran impulso de aprendizaje.",
      currentStreak: "Racha Actual",
      weeklyLearning: "Aprendizaje Semanal",
      goalCompletion: "Completado de Objetivos",
      days: "días",
      hours: "horas",
      learningGoals: "Objetivos de Aprendizaje",
      addGoal: "Añadir Objetivo",
      noGoals: "Aún no hay objetivos añadidos",
      createFirstGoal: "Crea tu primer objetivo",
      viewAll: "Ver todos",
      learningProgress: "Gráficos de Progreso de Aprendizaje",
      dailyActivity: "Actividad Diaria",
      weeklyTrends: "Tendencias Semanales",
      timeByType: "Tiempo por Tipo",
    },
    progress: {
      title: "Progreso de Aprendizaje",
      subtitle: "Sigue tu viaje de aprendizaje y ve lo lejos que has llegado",
      view: "Ver",
      week: "Semana",
      month: "Mes",
      year: "Año",
      allTime: "Todo el Tiempo",
      totalHours: "Horas Totales",
      topicsCovered: "Temas Cubiertos",
      currentStreak: "Racha Actual",
      avgDailyTime: "Tiempo Diario Promedio",
      best: "Mejor",
      from: "desde el último",
      learningActivity: "Actividad de Aprendizaje",
      hoursPerDay: "Horas dedicadas al aprendizaje por día",
    },
    goals: {
      title: "Objetivos de Aprendizaje",
      subtitle: "Establece, sigue y logra tus objetivos de aprendizaje",
      addNewGoal: "Añadir Nuevo Objetivo",
      activeGoals: "Objetivos Activos",
      completed: "Completados",
      allGoals: "Todos los Objetivos",
      noGoalsFound: "No se encontraron objetivos",
      addYourFirstGoal: "Añade tu primer objetivo",
      createNewGoal: "Crear Nuevo Objetivo de Aprendizaje",
      defineGoal: "Define tu objetivo de aprendizaje, establece una fecha límite y sigue tu progreso.",
      goalTitle: "Título del Objetivo",
      description: "Descripción",
      deadline: "Fecha Límite",
      priority: "Prioridad",
      high: "Alta",
      medium: "Media",
      low: "Baja",
      milestones: "Hitos",
      addMilestone: "Añadir Hito",
      createGoal: "Crear Objetivo",
      updateGoal: "Actualizar Objetivo",
      markComplete: "Marcar como Completado",
      deleteGoal: "Eliminar Objetivo",
      confirmDelete: "¿Estás seguro de que quieres eliminar este objetivo? Esta acción no se puede deshacer.",
      goalDeleted: "Tu objetivo de aprendizaje ha sido eliminado.",
      selectAll: "Seleccionar Todo",
      deleteSelected: "Eliminar Seleccionados",
      confirmDeleteMultiple:
        "¿Estás seguro de que quieres eliminar los objetivos seleccionados? Esta acción no se puede deshacer.",
      goalsDeleted: "Objetivos eliminados con éxito.",
      onTrack: "En Camino",
      atRisk: "En Riesgo",
      inProgress: "En Progreso",
      progress: "Progreso",
      status: "Estado",
      actions: "Acciones",
    },
    activity: {
      title: "Historial de Actividad",
      recentActivities: "Actividades de Aprendizaje Recientes",
      dragToReorder: "Arrastra elementos para reordenar por prioridad",
      noActivities: "Aún no hay actividades. Crea un nuevo objetivo para ver actividades aquí.",
      addActivity: "Añadir Actividad",
      duration: "Duración",
      date: "Fecha",
      priority: "Prioridad",
    },
    profile: {
      title: "Configuración de Perfil",
      personalInfo: "Información Personal",
      updateProfile: "Actualiza tu información de perfil y cómo te ven otros en la plataforma",
      profilePicture: "Foto de Perfil",
      changeProfilePic: "Cambiar Foto de Perfil",
      recommendedImage: "Recomendado: Imagen cuadrada, al menos 400x400px",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico",
      bio: "Biografía",
      saveChanges: "Guardar Cambios",
      profileUpdated: "Tu perfil ha sido actualizado con éxito.",
    },
    settings: {
      title: "Configuración",
      subtitle: "Administra la configuración y preferencias de tu cuenta",

      // Navigation
      appearanceNav: "Apariencia",
      notificationsNav: "Notificaciones",
      languageNav: "Idioma y Región",
      securityNav: "Seguridad",
      helpNav: "Ayuda y Soporte",

      // Appearance
      appearanceTitle: "Configuración de Apariencia",
      darkModeLabel: "Modo Oscuro",
      darkModeDesc: "Cambiar entre tema claro y oscuro",
      fontSizeLabel: "Tamaño de Fuente",
      fontSizeSmall: "Pequeño",
      fontSizeMedium: "Mediano",
      fontSizeLarge: "Grande",
      saveAppearance: "Guardar Configuración de Apariencia",

      // Notifications
      notificationsTitle: "Configuración de Notificaciones",
      emailNotifLabel: "Notificaciones por Correo",
      emailNotifDesc: "Recibe actualizaciones sobre tu progreso por correo electrónico",
      pushNotifLabel: "Notificaciones Push",
      pushNotifDesc: "Recibe notificaciones en tu dispositivo",
      weeklyLabel: "Resumen Semanal",
      weeklyDesc: "Obtén un informe semanal de tu progreso de aprendizaje",

      // Language & Region
      languageTitle: "Configuración de Idioma y Región",
      languageLabel: "Idioma",
      dateFormatLabel: "Formato de Fecha",
      saveLanguage: "Guardar Configuración de Idioma",

      // Security
      securityTitle: "Configuración de Seguridad",
      changePasswordTitle: "Cambiar Contraseña",
      currentPasswordLabel: "Contraseña Actual",
      newPasswordLabel: "Nueva Contraseña",
      confirmPasswordLabel: "Confirmar Nueva Contraseña",
      updatePasswordButton: "Actualizar Contraseña",
      twoFactorTitle: "Autenticación de Dos Factores",
      twoFactorDesc: "Añade una capa extra de seguridad a tu cuenta",
      enable2FAButton: "Habilitar 2FA",
      passwordsDoNotMatch: "Las contraseñas no coinciden",
      passwordTooShort: "La contraseña debe tener al menos 8 caracteres",
      passwordUpdatedTitle: "Contraseña Actualizada",
      passwordUpdatedDesc: "Su contraseña ha sido actualizada con éxito.",
      errorTitle: "Error",
      passwordUpdateError: "Error al actualizar la contraseña. Por favor, inténtelo de nuevo.",

      // Help & Support
      helpTitle: "Ayuda y Soporte",
      faqTitle: "Preguntas Frecuentes",
      faqQuestion1: "¿Cómo puedo seguir mi progreso de aprendizaje?",
      faqAnswer1: "Puedes seguir tu progreso de aprendizaje de varias maneras",
      faqQuestion2: "¿Cómo establezco objetivos de aprendizaje?",
      faqAnswer2: "Para establecer objetivos de aprendizaje",
      contactTitle: "Contactar Soporte",
      contactDesc: "¿Necesitas ayuda? Nuestro equipo de soporte está aquí para ti",
      subjectLabel: "Asunto",
      subjectPlaceholder: "¿Con qué necesitas ayuda?",
      messageLabel: "Mensaje",
      messagePlaceholder: "Describe tu problema en detalle",
      sendMessageButton: "Enviar Mensaje",
      messageSentTitle: "Mensaje enviado",
      messageSentDesc: "Te responderemos lo antes posible",
    },
  },
  fr: {
    common: {
      back: "Retour",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      loading: "Chargement...",
      search: "Rechercher",
      noResults: "Aucun résultat trouvé",
      welcome: "Bienvenue",
    },
    nav: {
      dashboard: "Tableau de bord",
      progress: "Progrès",
      goals: "Objectifs",
      activity: "Activité",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion",
    },
    dashboard: {
      welcomeBack: "Bon retour",
      keepUp: "Vous êtes sur une lancée ! Continuez sur cette belle dynamique d'apprentissage.",
      currentStreak: "Série Actuelle",
      weeklyLearning: "Apprentissage Hebdomadaire",
      goalCompletion: "Réalisation des Objectifs",
      days: "jours",
      hours: "heures",
      learningGoals: "Objectifs d'Apprentissage",
      addGoal: "Ajouter un Objectif",
      noGoals: "Aucun objectif ajouté pour l'instant",
      createFirstGoal: "Créez votre premier objectif",
      viewAll: "Voir tout",
      learningProgress: "Graphiques de Progression d'Apprentissage",
      dailyActivity: "Activité Quotidienne",
      weeklyTrends: "Tendances Hebdomadaires",
      timeByType: "Temps par Type",
    },
    progress: {
      title: "Progression d'Apprentissage",
      subtitle: "Suivez votre parcours d'apprentissage et voyez le chemin parcouru",
      view: "Voir",
      week: "Semaine",
      month: "Mois",
      year: "Année",
      allTime: "Tout le Temps",
      totalHours: "Heures Totales",
      topicsCovered: "Sujets Couverts",
      currentStreak: "Série Actuelle",
      avgDailyTime: "Temps Quotidien Moyen",
      best: "Meilleur",
      from: "depuis la dernière",
      learningActivity: "Activité d'Apprentissage",
      hoursPerDay: "Heures consacrées à l'apprentissage par jour",
    },
    goals: {
      title: "Objectifs d'Apprentissage",
      subtitle: "Définissez, suivez et atteignez vos objectifs d'apprentissage",
      addNewGoal: "Ajouter un Nouvel Objectif",
      activeGoals: "Objectifs Actifs",
      completed: "Terminés",
      allGoals: "Tous les Objectifs",
      noGoalsFound: "Aucun objectif trouvé",
      addYourFirstGoal: "Ajoutez votre premier objectif",
      createNewGoal: "Créer un Nouvel Objectif d'Apprentissage",
      defineGoal: "Définissez votre objectif d'apprentissage, fixez une échéance et suivez votre progression.",
      goalTitle: "Titre de l'Objectif",
      description: "Description",
      deadline: "Échéance",
      priority: "Priorité",
      high: "Haute",
      medium: "Moyenne",
      low: "Basse",
      milestones: "Jalons",
      addMilestone: "Ajouter un Jalon",
      createGoal: "Créer l'Objectif",
      updateGoal: "Mettre à Jour l'Objectif",
      markComplete: "Marquer comme Terminé",
      deleteGoal: "Supprimer l'Objectif",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer cet objectif ? Cette action ne peut pas être annulée.",
      goalDeleted: "Votre objectif d'apprentissage a été supprimé.",
      selectAll: "Tout Sélectionner",
      deleteSelected: "Supprimer la Sélection",
      confirmDeleteMultiple:
        "Êtes-vous sûr de vouloir supprimer les objectifs sélectionnés ? Cette action ne peut pas être annulée.",
      goalsDeleted: "Objectifs supprimés avec succès.",
      onTrack: "Sur la Bonne Voie",
      atRisk: "En Danger",
      inProgress: "En Cours",
      progress: "Progression",
      status: "Statut",
      actions: "Actions",
    },
    activity: {
      title: "Historique d'Activité",
      recentActivities: "Activités d'Apprentissage Récentes",
      dragToReorder: "Faites glisser les éléments pour les réorganiser par priorité",
      noActivities: "Pas encore d'activités. Créez un nouvel objectif pour voir les activités ici.",
      addActivity: "Ajouter une Activité",
      duration: "Durée",
      date: "Date",
      priority: "Priorité",
    },
    profile: {
      title: "Paramètres du Profil",
      personalInfo: "Informations Personnelles",
      updateProfile: "Mettez à jour vos informations de profil et comment les autres vous voient sur la plateforme",
      profilePicture: "Photo de Profil",
      changeProfilePic: "Changer la Photo de Profil",
      recommendedImage: "Recommandé : Image carrée, au moins 400x400px",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Adresse Email",
      bio: "Biographie",
      saveChanges: "Enregistrer les Modifications",
      profileUpdated: "Votre profil a été mis à jour avec succès.",
    },
    settings: {
      title: "Paramètres",
      subtitle: "Gérez les paramètres et les préférences de votre compte",

      // Navigation
      appearanceNav: "Apparence",
      notificationsNav: "Notifications",
      languageNav: "Langue et Région",
      securityNav: "Sécurité",
      helpNav: "Aide et Support",

      // Appearance
      appearanceTitle: "Paramètres d'Apparence",
      darkModeLabel: "Mode Sombre",
      darkModeDesc: "Basculer entre thème clair et sombre",
      fontSizeLabel: "Taille de Police",
      fontSizeSmall: "Petit",
      fontSizeMedium: "Moyen",
      fontSizeLarge: "Grand",
      saveAppearance: "Enregistrer les Paramètres d'Apparence",

      // Notifications
      notificationsTitle: "Paramètres de Notifications",
      emailNotifLabel: "Notifications par Email",
      emailNotifDesc: "Recevez des mises à jour sur votre progression par email",
      pushNotifLabel: "Notifications Push",
      pushNotifDesc: "Recevez des notifications sur votre appareil",
      weeklyLabel: "Résumé Hebdomadaire",
      weeklyDesc: "Obtenez un rapport hebdomadaire de votre progression d'apprentissage",

      // Language & Region
      languageTitle: "Paramètres de Langue et Région",
      languageLabel: "Langue",
      dateFormatLabel: "Format de Date",
      saveLanguage: "Enregistrer les Paramètres de Langue",

      // Security
      securityTitle: "Paramètres de Sécurité",
      changePasswordTitle: "Changer le Mot de Passe",
      currentPasswordLabel: "Mot de Passe Actuel",
      newPasswordLabel: "Nouveau Mot de Passe",
      confirmPasswordLabel: "Confirmer le Nouveau Mot de Passe",
      updatePasswordButton: "Mettre à Jour le Mot de Passe",
      twoFactorTitle: "Authentification à Deux Facteurs",
      twoFactorDesc: "Ajoutez une couche supplémentaire de sécurité à votre compte",
      enable2FAButton: "Activer 2FA",
      passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
      passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
      passwordUpdatedTitle: "Mot de passe mis à jour",
      passwordUpdatedDesc: "Votre mot de passe a été mis à jour avec succès.",
      errorTitle: "Erreur",
      passwordUpdateError: "Échec de la mise à jour du mot de passe. Veuillez réessayer.",

      // Help & Support
      helpTitle: "Aide et Support",
      faqTitle: "Questions Fréquemment Posées",
      faqQuestion1: "Comment puis-je suivre ma progression d'apprentissage?",
      faqAnswer1: "Vous pouvez suivre votre progression d'apprentissage de plusieurs façons",
      faqQuestion2: "Comment définir des objectifs d'apprentissage?",
      faqAnswer2: "Pour définir des objectifs d'apprentissage",
      contactTitle: "Contacter le Support",
      contactDesc: "Besoin d'aide? Notre équipe de support est là pour vous",
      subjectLabel: "Sujet",
      subjectPlaceholder: "En quoi pouvons-nous vous aider?",
      messageLabel: "Message",
      messagePlaceholder: "Décrivez votre problème en détail",
      sendMessageButton: "Envoyer le Message",
      messageSentTitle: "Message envoyé",
      messageSentDesc: "Nous vous répondrons dès que possible",
    },
  },
  de: {
    common: {
      back: "Zurück",
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      loading: "Wird geladen...",
      search: "Suchen",
      noResults: "Keine Ergebnisse gefunden",
      welcome: "Willkommen",
    },
    nav: {
      dashboard: "Dashboard",
      progress: "Fortschritt",
      goals: "Ziele",
      activity: "Aktivität",
      profile: "Profil",
      settings: "Einstellungen",
      logout: "Abmelden",
    },
    dashboard: {
      welcomeBack: "Willkommen zurück",
      keepUp: "Du bist auf einer Erfolgswelle! Behalte den großartigen Lernrhythmus bei.",
      currentStreak: "Aktuelle Serie",
      weeklyLearning: "Wöchentliches Lernen",
      goalCompletion: "Zielerreichung",
      days: "Tage",
      hours: "Stunden",
      learningGoals: "Lernziele",
      addGoal: "Ziel hinzufügen",
      noGoals: "Noch keine Ziele hinzugefügt",
      createFirstGoal: "Erstelle dein erstes Ziel",
      viewAll: "Alle anzeigen",
      learningProgress: "Lernfortschrittsdiagramme",
      dailyActivity: "Tägliche Aktivität",
      weeklyTrends: "Wöchentliche Trends",
      timeByType: "Zeit nach Typ",
    },
    progress: {
      title: "Lernfortschritt",
      subtitle: "Verfolge deine Lernreise und sieh, wie weit du gekommen bist",
      view: "Ansicht",
      week: "Woche",
      month: "Monat",
      year: "Jahr",
      allTime: "Gesamtzeit",
      totalHours: "Gesamtstunden",
      topicsCovered: "Behandelte Themen",
      currentStreak: "Aktuelle Serie",
      avgDailyTime: "Durchschn. tägliche Zeit",
      best: "Beste",
      from: "seit letzter",
      learningActivity: "Lernaktivität",
      hoursPerDay: "Stunden pro Tag mit Lernen verbracht",
    },
    goals: {
      title: "Lernziele",
      subtitle: "Setze, verfolge und erreiche deine Lernziele",
      addNewGoal: "Neues Ziel hinzufügen",
      activeGoals: "Aktive Ziele",
      completed: "Abgeschlossen",
      allGoals: "Alle Ziele",
      noGoalsFound: "Keine Ziele gefunden",
      addYourFirstGoal: "Füge dein erstes Ziel hinzu",
      createNewGoal: "Neues Lernziel erstellen",
      defineGoal: "Definiere dein Lernziel, setze eine Frist und verfolge deinen Fortschritt.",
      goalTitle: "Zieltitel",
      description: "Beschreibung",
      deadline: "Frist",
      priority: "Priorität",
      high: "Hoch",
      medium: "Mittel",
      low: "Niedrig",
      milestones: "Meilensteine",
      addMilestone: "Meilenstein hinzufügen",
      createGoal: "Ziel erstellen",
      updateGoal: "Ziel aktualisieren",
      markComplete: "Als abgeschlossen markieren",
      deleteGoal: "Ziel löschen",
      confirmDelete:
        "Bist du sicher, dass du dieses Ziel löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
      goalDeleted: "Dein Lernziel wurde gelöscht.",
      selectAll: "Alle auswählen",
      deleteSelected: "Ausgewählte löschen",
      confirmDeleteMultiple:
        "Bist du sicher, dass du die ausgewählten Ziele löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
      goalsDeleted: "Ziele erfolgreich gelöscht.",
      onTrack: "Auf Kurs",
      atRisk: "Gefährdet",
      inProgress: "In Bearbeitung",
      progress: "Fortschritt",
      status: "Status",
      actions: "Aktionen",
    },
    activity: {
      title: "Aktivitätsverlauf",
      recentActivities: "Aktuelle Lernaktivitäten",
      dragToReorder: "Elemente ziehen, um nach Priorität neu zu ordnen",
      noActivities: "Noch keine Aktivitäten. Erstelle ein neues Ziel, um hier Aktivitäten zu sehen.",
      addActivity: "Aktivität hinzufügen",
      duration: "Dauer",
      date: "Datum",
      priority: "Priorität",
    },
    profile: {
      title: "Profileinstellungen",
      personalInfo: "Persönliche Informationen",
      updateProfile: "Aktualisiere deine Profilinformationen und wie andere dich auf der Plattform sehen",
      profilePicture: "Profilbild",
      changeProfilePic: "Profilbild ändern",
      recommendedImage: "Empfohlen: Quadratisches Bild, mindestens 400x400px",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail-Adresse",
      bio: "Biografie",
      saveChanges: "Änderungen speichern",
      profileUpdated: "Dein Profil wurde erfolgreich aktualisiert.",
    },
    settings: {
      title: "Einstellungen",
      subtitle: "Verwalten Sie Ihre Kontoeinstellungen und Präferenzen",

      // Navigation
      appearanceNav: "Erscheinungsbild",
      notificationsNav: "Benachrichtigungen",
      languageNav: "Sprache & Region",
      securityNav: "Sicherheit",
      helpNav: "Hilfe & Support",

      // Appearance
      appearanceTitle: "Erscheinungsbild-Einstellungen",
      darkModeLabel: "Dunkelmodus",
      darkModeDesc: "Zwischen hellem und dunklem Design wechseln",
      fontSizeLabel: "Schriftgröße",
      fontSizeSmall: "Klein",
      fontSizeMedium: "Mittel",
      fontSizeLarge: "Groß",
      saveAppearance: "Erscheinungsbild-Einstellungen speichern",

      // Notifications
      notificationsTitle: "Benachrichtigungseinstellungen",
      emailNotifLabel: "E-Mail-Benachrichtigungen",
      emailNotifDesc: "Erhalten Sie Updates zu Ihrem Fortschritt per E-Mail",
      pushNotifLabel: "Push-Benachrichtigungen",
      pushNotifDesc: "Erhalten Sie Benachrichtigungen auf Ihrem Gerät",
      weeklyLabel: "Wöchentliche Zusammenfassung",
      weeklyDesc: "Erhalten Sie einen wöchentlichen Bericht über Ihren Lernfortschritt",

      // Language & Region
      languageTitle: "Sprach- und Regioneinstellungen",
      languageLabel: "Sprache",
      dateFormatLabel: "Datumsformat",
      saveLanguage: "Spracheinstellungen speichern",

      // Security
      securityTitle: "Sicherheitseinstellungen",
      changePasswordTitle: "Passwort ändern",
      currentPasswordLabel: "Aktuelles Passwort",
      newPasswordLabel: "Neues Passwort",
      confirmPasswordLabel: "Neues Passwort bestätigen",
      updatePasswordButton: "Passwort aktualisieren",
      twoFactorTitle: "Zwei-Faktor-Authentifizierung",
      twoFactorDesc: "Fügen Sie Ihrem Konto eine zusätzliche Sicherheitsebene hinzu",
      enable2FAButton: "2FA aktivieren",
      passwordsDoNotMatch: "Passwörter stimmen nicht überein",
      passwordTooShort: "Das Passwort muss mindestens 8 Zeichen lang sein",
      passwordUpdatedTitle: "Passwort aktualisiert",
      passwordUpdatedDesc: "Ihr Passwort wurde erfolgreich aktualisiert.",
      errorTitle: "Fehler",
      passwordUpdateError: "Fehler beim Aktualisieren des Passworts. Bitte versuchen Sie es erneut.",

      // Help & Support
      helpTitle: "Hilfe & Support",
      faqTitle: "Häufig gestellte Fragen",
      faqQuestion1: "Wie kann ich meinen Lernfortschritt verfolgen?",
      faqAnswer1: "Sie können Ihren Lernfortschritt auf verschiedene Weise verfolgen",
      faqQuestion2: "Wie setze ich Lernziele?",
      faqAnswer2: "Um Lernziele zu setzen",
      contactTitle: "Support kontaktieren",
      contactDesc: "Brauchen Sie Hilfe? Unser Support-Team ist für Sie da",
      subjectLabel: "Betreff",
      subjectPlaceholder: "Wobei benötigen Sie Hilfe?",
      messageLabel: "Nachricht",
      messagePlaceholder: "Beschreiben Sie Ihr Problem im Detail",
      sendMessageButton: "Nachricht senden",
      messageSentTitle: "Nachricht gesendet",
      messageSentDesc: "Wir werden uns so schnell wie möglich bei Ihnen melden",
    },
  },
  ja: {
    common: {
      back: "戻る",
      save: "保存",
      cancel: "キャンセル",
      delete: "削除",
      edit: "編集",
      loading: "読み込み中...",
      search: "検索",
      noResults: "結果が見つかりません",
      welcome: "ようこそ",
    },
    nav: {
      dashboard: "ダッシュボード",
      progress: "進捗",
      goals: "目標",
      activity: "活動",
      profile: "プロフィール",
      settings: "設定",
      logout: "ログアウト",
    },
    dashboard: {
      welcomeBack: "おかえりなさい",
      keepUp: "好調です！素晴らしい学習の勢いを維持しましょう。",
      currentStreak: "現在の連続記録",
      weeklyLearning: "週間学習",
      goalCompletion: "目標達成",
      days: "日",
      hours: "時間",
      learningGoals: "学習目標",
      addGoal: "目標を追加",
      noGoals: "まだ目標が追加されていません",
      createFirstGoal: "最初の目標を作成する",
      viewAll: "すべて表示",
      learningProgress: "学習進捗チャート",
      dailyActivity: "日々の活動",
      weeklyTrends: "週間トレンド",
      timeByType: "タイプ別時間",
    },
    progress: {
      title: "学習の進捗",
      subtitle: "学習の旅を追跡し、どれだけ進んだかを確認しましょう",
      view: "表示",
      week: "週",
      month: "月",
      year: "年",
      allTime: "全期間",
      totalHours: "合計時間",
      topicsCovered: "カバーしたトピック",
      currentStreak: "現在の連続記録",
      avgDailyTime: "平均日間時間",
      best: "最高",
      from: "前回から",
      learningActivity: "学習活動",
      hoursPerDay: "1日あたりの学習時間",
    },
    goals: {
      title: "学習目標",
      subtitle: "学習目標を設定し、追跡し、達成しましょう",
      addNewGoal: "新しい目標を追加",
      activeGoals: "アクティブな目標",
      completed: "完了",
      allGoals: "すべての目標",
      noGoalsFound: "目標が見つかりません",
      addYourFirstGoal: "最初の目標を追加する",
      createNewGoal: "新しい学習目標を作成",
      defineGoal: "学習目標を定義し、期限を設定し、進捗を追跡します。",
      goalTitle: "目標タイトル",
      description: "説明",
      deadline: "期限",
      priority: "優先度",
      high: "高",
      medium: "中",
      low: "低",
      milestones: "マイルストーン",
      addMilestone: "マイルストーンを追加",
      createGoal: "目標を作成",
      updateGoal: "目標を更新",
      markComplete: "完了としてマーク",
      deleteGoal: "目標を削除",
      confirmDelete: "この目標を削除してもよろしいですか？この操作は元に戻せません。",
      goalDeleted: "学習目標が削除されました。",
      selectAll: "すべて選択",
      deleteSelected: "選択したものを削除",
      confirmDeleteMultiple: "選択した目標を削除してもよろしいですか？この操作は元に戻せません。",
      goalsDeleted: "目標が正常に削除されました。",
      onTrack: "順調",
      atRisk: "リスクあり",
      inProgress: "進行中",
      progress: "進捗",
      status: "状態",
      actions: "アクション",
    },
    activity: {
      title: "活動履歴",
      recentActivities: "最近の学習活動",
      dragToReorder: "優先度で並べ替えるためにアイテムをドラッグ",
      noActivities: "まだ活動はありません。新しい目標を作成して、ここに活動を表示します。",
      addActivity: "活動を追加",
      duration: "期間",
      date: "日付",
      priority: "優先度",
    },
    profile: {
      title: "プロフィール設定",
      personalInfo: "個人情報",
      updateProfile: "プロフィール情報を更新し、プラットフォーム上での表示方法を設定します",
      profilePicture: "プロフィール画像",
      changeProfilePic: "プロフィール画像を変更",
      recommendedImage: "推奨：正方形の画像、少なくとも400x400px",
      firstName: "名",
      lastName: "姓",
      email: "メールアドレス",
      bio: "自己紹介",
      saveChanges: "変更を保存",
      profileUpdated: "プロフィールが正常に更新されました。",
    },
    settings: {
      title: "設定",
      subtitle: "アカウント設定と環境設定を管理する",

      // Navigation
      appearanceNav: "外観",
      notificationsNav: "通知",
      languageNav: "言語と地域",
      securityNav: "セキュリティ",
      helpNav: "ヘルプとサポート",

      // Appearance
      appearanceTitle: "外観設定",
      darkModeLabel: "ダークモード",
      darkModeDesc: "ライトテーマとダークテーマを切り替える",
      fontSizeLabel: "フォントサイズ",
      fontSizeSmall: "小",
      fontSizeMedium: "中",
      fontSizeLarge: "大",
      saveAppearance: "外観設定を保存",

      // Notifications
      notificationsTitle: "通知設定",
      emailNotifLabel: "メール通知",
      emailNotifDesc: "メールで進捗状況の更新を受け取る",
      pushNotifLabel: "プッシュ通知",
      pushNotifDesc: "デバイスで通知を受け取る",
      weeklyLabel: "週間サマリー",
      weeklyDesc: "学習の進捗状況の週間レポートを取得する",

      // Language & Region
      languageTitle: "言語と地域の設定",
      languageLabel: "言語",
      dateFormatLabel: "日付形式",
      saveLanguage: "言語設定を保存",

      // Security
      securityTitle: "セキュリティ設定",
      changePasswordTitle: "パスワードの変更",
      currentPasswordLabel: "現在のパスワード",
      newPasswordLabel: "新しいパスワード",
      confirmPasswordLabel: "新しいパスワードの確認",
      updatePasswordButton: "パスワードを更新",
      twoFactorTitle: "二要素認証",
      twoFactorDesc: "アカウントにセキュリティレイヤーを追加",
      enable2FAButton: "2FAを有効にする",
      passwordsDoNotMatch: "パスワードが一致しません",
      passwordTooShort: "パスワードは8文字以上である必要があります",
      passwordUpdatedTitle: "パスワードが更新されました",
      passwordUpdatedDesc: "パスワードが正常に更新されました。",
      errorTitle: "エラー",
      passwordUpdateError: "パスワードの更新に失敗しました。もう一度お試しください。",

      // Help & Support
      helpTitle: "ヘルプとサポート",
      faqTitle: "よくある質問",
      faqQuestion1: "学習の進捗状況を追跡するにはどうすればよいですか？",
      faqAnswer1: "学習の進捗状況を追跡するにはいくつかの方法があります",
      faqQuestion2: "学習目標を設定するにはどうすればよいですか？",
      faqAnswer2: "学習目標を設定するには",
      contactTitle: "サポートに連絡",
      contactDesc: "助けが必要ですか？サポートチームがお手伝いします",
      subjectLabel: "件名",
      subjectPlaceholder: "何についてお手伝いが必要ですか？",
      messageLabel: "メッセージ",
      messagePlaceholder: "問題を詳細に説明してください",
      sendMessageButton: "メッセージを送信",
      messageSentTitle: "メッセージが送信されました",
      messageSentDesc: "できるだけ早くご連絡いたします",
    },
  },
}

// Create the provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [dateFormat, setDateFormat] = useState<DateFormat>("mdy")

  // Format date based on selected format
  const formatDate = (date: string | Date): string => {
    const d = new Date(date)

    switch (dateFormat) {
      case "dmy":
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`
      case "ymd":
        return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`
      default: // mdy
        return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}/${d.getFullYear()}`
    }
  }

  // Save language settings to localStorage
  const saveLanguageSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userLanguage", language)
      localStorage.setItem("dateFormat", dateFormat)
    }
  }

  // Load language settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("userLanguage") as Language | null
      const savedDateFormat = localStorage.getItem("dateFormat") as DateFormat | null

      if (savedLanguage) {
        setLanguage(savedLanguage)
      }

      if (savedDateFormat) {
        setDateFormat(savedDateFormat)
      }
    }
  }, [])

  // Create context value
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    dateFormat,
    setDateFormat,
    t: translations[language],
    formatDate,
    saveLanguageSettings,
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }

  return context
}
