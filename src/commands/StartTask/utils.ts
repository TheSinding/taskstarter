/* eslint-disable @typescript-eslint/naming-convention */
import * as config from '../../configuration'
import { WorkItemType } from '../../@types/azure'
import { sanitize } from '../../utils/sanitizeBranch'
import { QuickPickItem } from 'vscode'
import { ThemeIconName } from '../../@types/VscodeTypes'

type BranchType = 'feature' | 'bugfix' | 'hotfix'
type BowtieIconName = 'symbol-list' | 'symbol-bug' | 'symbol-task'

type IconName = BowtieIconName | ThemeIconName

export const getWorkItemIcon = (type: WorkItemType) => {
  const icons: Partial<Record<WorkItemType, IconName>> = {
    Bug: 'symbol-bug',
    'Product Backlog Item': 'symbol-list',
    Task: 'symbol-task',
  }
  return type in icons ? `$(${icons[type]})` : ''
}

export const stripIcons = (str: string) => str.replaceAll(/\$\(.+?\)/g, '')

export const nameBranch = (task: QuickPickItem, parentType: WorkItemType = 'Product Backlog Item') => {
  let label = stripIcons(task.label)

  const customBranchRegex = config.getProjectKey('customBranchRegex')
  if (customBranchRegex) {
    const regex = new RegExp(customBranchRegex, 'g')
    label = label.replaceAll(regex, '')
  }
  label = sanitize(label)

  const branchName = `${getBranchType(parentType)}/${task.description}-${label}`
  return branchName
}

const branchTypes: Partial<Record<WorkItemType, BranchType>> = {
  'Product Backlog Item': 'feature',
  Bug: 'bugfix',
  Task: 'feature',
  Feature: 'feature',
  Issue: 'feature',
}

const getBranchType = (workItemType: WorkItemType) =>
  workItemType in branchTypes ? branchTypes[workItemType] : branchTypes['Task']
