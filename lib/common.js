async function find(appkit, app, id_or_name) {
    let addons = await appkit.api.get(`/apps/${app}/addons`)
    let s3 = null
    if(id_or_name) {
      s3 = addons.filter((x) => ((x.id === id_or_name || x.name === id_or_name) && (x.addon_service.name === 'alamo-s3' || x.addon_service.name === 'akkeris-s3')))[0]
    } else {
      s3 = addons.filter((x) => (x.addon_service.name === 'alamo-s3' || x.addon_service.name === 'akkeris-s3'))[0]
    }
    if(!s3) {
      let attachments = await appkit.api.get(`/apps/${app}/addon-attachments`)
      let s3 = null
      if(id_or_name) {
        s3 = attachments.filter((x) => ((x.id === id_or_name || x.name === id_or_name) && (x.addon_service.name === 'alamo-s3' || x.addon_service.name === 'akkeris-s3')))[0]
      } else {
        s3 = attachments.filter((x) => (x.addon.plan.name.startsWith('akkeris-s3')))[0]
      }
      if(!s3) {
        throw new Error("An s3 bucket could not found.")
      } else {
        throw new Error(appkit.terminal.markdown(`The bucket on this app is not owned by **${app}**. Try re-running the command on the owner app ***${s3.addon.app.name}***`))
      }
    }
    return s3
  }