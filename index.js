const common = require('./lib/common')

async function cred_rotate (appkit, args) {
  try {
    let s3 = await common.find(appkit, args.app, args.bucket)
    let data = null
    let values = {}
    values["IAM_ROTATE_DATE"] = Date.now()
    if (s3.addon_service.name === 'akkeris-s3') {
      data = await appkit.api.put(null, `/apps/${args.app}/addons/${s3.id}/actions/credentials`)
      await appkit.api.patch(null, `/apps/${args.app}/config-vars`)
    } else {
      throw new Error(`The ${s3.plan.name} is not a valid s3 addon.`)
    }
    delete data.Plan
    appkit.terminal.vtable(data)
  } catch (err) {
    appkit.terminal.error(err)
  }
}

module.exports = {
  init:function (appkit) {
    let require_options = {
      'app':{
        'alias':'a',
        'demand':false,
        'string':true,
        'description':'The app to act on.'
      },
      'bucket':{
        'alias':'b',
        'demand':false,
        'string':true,
        'description':'The name of the s3 addon to use'
      }
    }

    appkit.args
      .command('s3:rotate', 'rotate credentials', require_options, cred_rotate.bind(null, appkit))
  },
  update:function() {},
  'group':'s3',
  'help':'manage s3 addon',
  'primary':false
}
